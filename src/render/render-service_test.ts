import TestBase from '../testbase';
TestBase.init();

import Mocks from '../../node_modules/gs-tools/src/mock/mocks';
import PostMessageChannel from '../../node_modules/gs-tools/src/ui/post-message-channel';
import { RenderService } from './render-service';
import TestDispose from '../../node_modules/gs-tools/src/testing/test-dispose';


describe('render.RenderService', () => {
  let mock$document;
  let mock$window;
  let service;

  beforeEach(() => {
    mock$document = jasmine.createSpyObj('$document', ['createElement']);
    mock$window = jasmine.createSpyObj('$window', ['addEventListener', 'removeEventListener']);
    mock$window.location = {};
    service = new RenderService([mock$document], mock$window);
    TestDispose.add(service);
  });

  describe('iframeElChannelPromise_', () => {
    it('should open the channel correctly', (done: any) => {
      let mockPostMessageChannel = Mocks.disposable();
      let mockContentWindow = Mocks.object('ContentWindow');
      let mockIframeEl = Mocks.object('IframeEl');

      mockIframeEl.contentWindow = mockContentWindow;

      Object.defineProperty(service, 'iframeElPromise', {
        get() {
          return Promise.resolve(mockIframeEl);
        }
      });

      spyOn(PostMessageChannel, 'open').and.returnValue(Promise.resolve(mockPostMessageChannel));

      service['iframeElChannelPromise_']
          .then((channel: PostMessageChannel) => {
            expect(channel).toEqual(mockPostMessageChannel);
            expect(PostMessageChannel.open).toHaveBeenCalledWith(mock$window, mockContentWindow);
            done();
          }, done.fail);
    });
  });

  describe('onRequest_', () => {
    let mockIframeEl;

    beforeEach(() => {
      mockIframeEl = jasmine.createSpyObj('IframeEl', ['addEventListener']);
      mockIframeEl.contentWindow = jasmine.createSpyObj('IframeEl.contentWindow', ['postMessage']);
      mockIframeEl.addEventListener.and.callFake((type: any, handler: Function) => {
        handler();
      });
      mockIframeEl.style = {};
      mock$document.createElement.and.returnValue(mockIframeEl);
    });

    it('should resolves with the data URI', (done: jasmine.IDoneFn) => {
      let content = 'content';
      let width = 123;
      let height = 456;
      let id = 12;
      let dataUri = 'dataUri';
      let mockPostMessageChannel =
          jasmine.createSpyObj('PostMessageChannel', ['post', 'waitForMessage']);
      mockPostMessageChannel.waitForMessage.and.returnValue(Promise.resolve({
        id: id,
        uri: dataUri
      }));

      spyOn(Math, 'random').and.returnValue(id);

      Object.defineProperty(service, 'iframeElPromise', {
        get() {
          return Promise.resolve(mockIframeEl);
        }
      });
      Object.defineProperty(service, 'iframeElChannelPromise_', {
        get() {
          return Promise.resolve(mockPostMessageChannel);
        }
      });

      service
          .onRequest_({ content: content, height: height, width: width })
          .then((actualDataUri: any) => {
            expect(actualDataUri).toEqual(dataUri);
            expect(mockPostMessageChannel.post).toHaveBeenCalledWith({
              'content': content,
              'height': height,
              'id': id,
              'width': width,
            });

            expect(mockPostMessageChannel.waitForMessage.calls.argsFor(0)[0]({ id: id }))
                .toEqual(true);

            expect(mockIframeEl.style.width).toEqual(`${width}px`);
            expect(mockIframeEl.style.height).toEqual(`${height}px`);
            done();
          }, done.fail);
    });

    it('should ignore messages with a different ID', (done: jasmine.IDoneFn) => {
      let mockPostMessageChannel =
          jasmine.createSpyObj('PostMessageChannel', ['post', 'waitForMessage']);
      mockPostMessageChannel.waitForMessage.and.returnValue(Promise.resolve({
        uri: 'uri'
      }));

      Object.defineProperty(service, 'iframeElPromise', {
        get() {
          return Promise.resolve(mockIframeEl);
        }
      });
      Object.defineProperty(service, 'iframeElChannelPromise_', {
        get() {
          return Promise.resolve(mockPostMessageChannel);
        }
      });

      service
          .onRequest_({ content: 'content', height: 123, width: 456 })
          .then((actualDataUri: any) => {
            expect(mockPostMessageChannel.waitForMessage.calls.argsFor(0)[0]({ id: 'otherId' }))
                .toEqual(false);
            done();
          }, done.fail);
    });
  });

  describe('get iframeElPromise', () => {
    let mockBody;

    beforeEach(() => {
      mockBody = jasmine.createSpyObj('Body', ['appendChild']);
      mock$document.body = mockBody;
    });

    it('should resolves with the newly created iframe', (done: jasmine.IDoneFn) => {
      let mockIframeEl = jasmine.createSpyObj('IframeEl', ['addEventListener']);
      mockIframeEl.addEventListener.and.callFake((type: any, handler: Function) => {
        handler();
      });
      mockIframeEl.style = {};
      mock$document.createElement.and.returnValue(mockIframeEl);

      service.iframeElPromise
          .then((iframeEl: any) => {
            expect(mock$document.createElement).toHaveBeenCalledWith('iframe');
            expect(iframeEl.addEventListener).toHaveBeenCalledWith('load', jasmine.any(Function));
            expect(iframeEl).toEqual(mockIframeEl);
            expect(mockBody.appendChild).toHaveBeenCalledWith(iframeEl);
            done();
          }, done.fail);
    });

    it('should cache the iframe', (done: jasmine.IDoneFn) => {
      let mockIframeEl = jasmine.createSpyObj('IframeEl', ['addEventListener']);
      mockIframeEl.addEventListener.and.callFake((type: any, handler: Function) => {
        handler();
      });
      mockIframeEl.style = {};
      mock$document.createElement.and.returnValue(mockIframeEl);

      service.iframeElPromise
          .then((iframeEl: any) => {
            mock$document.createElement.calls.reset();
            return Promise.all([
              iframeEl,
              service.iframeElPromise,
            ]);
          })
          .then((values: any) => {
            let [firstInputEl, secondInputEl] = values;
            expect(secondInputEl).toEqual(firstInputEl);
            expect(mock$document.createElement).not.toHaveBeenCalled();
            done();
          }, done.fail);
    });
  });

  describe('render', () => {
    let spyRequestPoolQueue;

    beforeEach(() => {
      spyRequestPoolQueue = spyOn(service.requestPool_, 'queue');
    });

    it('should queue the request to the request pool', () => {
      let content = 'content';
      let width = 123;
      let height = 456;
      let promise = {};

      spyRequestPoolQueue.and.returnValue(promise);

      expect(service.render(content, width, height)).toEqual(promise);
      expect(spyRequestPoolQueue).toHaveBeenCalledWith({
        content: content,
        height: height,
        width: width,
      });
    });
  });
});
