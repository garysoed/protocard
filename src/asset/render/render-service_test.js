import TestBase from '../../testbase';

import RenderService from './render-service';

describe('asset.render.RenderService', () => {
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
      mock$window.location.host = host;
      mock$window.location.protocol = protocol;

      let event = { data: 'dataUri', origin: origin };
      mock$window.addEventListener.and.callFake((type, handler) => {
        handler(event);
      });

      service.render(content, width, height)
          .then(dataUri => {
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
            expect(dataUri).toEqual(event.data);

            expect(service.hasOngoingRendering()).toEqual(false);
            done();
          }, done.fail);
      expect(service.hasOngoingRendering()).toEqual(true);
    });

    it('should throw exception if there is an ongoing rendering process', () => {
        let host = 'abs.url:8080';
        let protocol = 'http:';
        let origin = `${protocol}//${host}`;
        mock$window.location.host = host;
        mock$window.location.protocol = protocol;

        service.render('content1', 123, 456);
        expect(() => service.render('content2', 789, 12)).toThrowError(/currently running/);
    });

    it('should ignore messages from other origin', done => {
        mock$window.location.host = 'abs.url';
        mock$window.location.protocol = 'http:';
        mock$window.addEventListener.and.callFake((type, handler) => {
          handler({ data: 'dataUri', origin: 'https://other.origin' });
        });

        service.render('content', 123, 4456).then(done.fail, done.fail);
        setTimeout(done, 1);
        jasmine.clock().tick(2);
    });
  });
});
