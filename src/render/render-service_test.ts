import TestBase from '../testbase';
TestBase.init();

import RenderService from './render-service';

describe('render.RenderService', () => {
  let mock$document;
  let mock$window;
  let service;

  beforeEach(() => {
    mock$document = jasmine.createSpyObj('$document', ['createElement']);
    mock$window = jasmine.createSpyObj('$window', ['addEventListener', 'removeEventListener']);
    mock$window.location = {};
    service = new RenderService([mock$document], mock$window);
  });

  describe('get iframeElPromise', () => {
    let mockBody;

    beforeEach(() => {
      mockBody = jasmine.createSpyObj('Body', ['appendChild']);
      mock$document.body = mockBody;
    });

    it('should resolves with the newly created iframe', done => {
      let mockIframeEl = jasmine.createSpyObj('IframeEl', ['addEventListener']);
      mockIframeEl.addEventListener.and.callFake((type, handler) => {
        handler();
      });
      mockIframeEl.style = {};
      mock$document.createElement.and.returnValue(mockIframeEl);

      service.iframeElPromise
          .then(iframeEl => {
            expect(mock$document.createElement).toHaveBeenCalledWith('iframe');
            expect(iframeEl.addEventListener).toHaveBeenCalledWith('load', jasmine.any(Function));
            expect(iframeEl).toEqual(mockIframeEl);
            expect(mockBody.appendChild).toHaveBeenCalledWith(iframeEl);
            done();
          }, done.fail);
    });

    it('should cache the iframe', done => {
      let mockIframeEl = jasmine.createSpyObj('IframeEl', ['addEventListener']);
      mockIframeEl.addEventListener.and.callFake((type, handler) => {
        handler();
      });
      mockIframeEl.style = {};
      mock$document.createElement.and.returnValue(mockIframeEl);

      service.iframeElPromise
          .then(iframeEl => {
            mock$document.createElement.calls.reset();
            return Promise.all([
              iframeEl,
              service.iframeElPromise
            ]);
          })
          .then(values => {
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
        width: width
      });
    });
  });

  describe('onRequest_', () => {
    let mockIframeEl;

    beforeEach(() => {
      mockIframeEl = jasmine.createSpyObj('IframeEl', ['addEventListener']);
      mockIframeEl.contentWindow = jasmine.createSpyObj('IframeEl.contentWindow', ['postMessage']);
      mockIframeEl.addEventListener.and.callFake((type, handler) => {
        handler();
      });
      mockIframeEl.style = {};
      mock$document.createElement.and.returnValue(mockIframeEl);
    });

    it('should resolves with the data URI', done => {
      let content = 'content';
      let width = 123;
      let height = 456;
      let host = 'abs.url:8080';
      let protocol = 'http:';
      let origin = `${protocol}//${host}`;
      let id = 12;
      let dataUri = 'dataUri';
      mock$window.location.host = host;
      mock$window.location.protocol = protocol;

      let event = { data: { id: id, uri: dataUri }, origin: origin };
      mock$window.addEventListener.and.callFake((type, handler) => {
        handler(event);
      });

      spyOn(Math, 'random').and.returnValue(id);

      service
          .onRequest_({ content: content, height: height, width: width })
          .then(actualDataUri => {
            expect(mock$window.addEventListener)
                .toHaveBeenCalledWith('message', jasmine.any(Function));
            let handler = mock$window.addEventListener.calls.argsFor(0)[1];
            expect(mock$window.removeEventListener).toHaveBeenCalledWith('message', handler);

            expect(mockIframeEl.style.width).toEqual(`${width}px`);
            expect(mockIframeEl.style.height).toEqual(`${height}px`);
            expect(mockIframeEl.contentWindow.postMessage)
                .toHaveBeenCalledWith(
                    jasmine.objectContaining({
                      'content': content,
                      'height': height,
                      'width': width
                    }),
                    origin);
            expect(actualDataUri).toEqual(dataUri);
            done();
          }, done.fail);
    });

    it('should ignore messages from other origin', done => {
      jasmine.clock().install();
      mock$window.location.host = 'abs.url';
      mock$window.location.protocol = 'http:';
      mock$window.addEventListener.and.callFake((type, handler) => {
        handler({ data: 'dataUri', origin: 'https://other.origin' });
      });

      service
          .onRequest_({ content: 'content', height: 4456, width: 123, })
          .then(done.fail, done.fail);
      setTimeout(() => {
        jasmine.clock().uninstall();
        done();
      }, 1);
      jasmine.clock().tick(2);
    });

    it('should ignore messages with a different ID', done => {
      jasmine.clock().install();
      mock$window.location.host = 'abs.url';
      mock$window.location.protocol = 'http:';
      mock$window.addEventListener.and.callFake((type, handler) => {
        handler({ data: { id: 'otherId', uri: 'dataUri' }, origin: 'https://other.origin' });
      });

      spyOn(Math, 'random').and.returnValue('expectedId');

      service
          .onRequest_({ content: 'content', height: 4456, width: 123 })
          .then(done.fail, done.fail);
      setTimeout(() => {
        jasmine.clock().uninstall();
        done();
      }, 1);
      jasmine.clock().tick(2);
    });
  });
});
