import TestBase from '../../testbase';

import FakeDocument from '../../testing/fake-document';
import PreviewAppCtrl from './preview-app-ctrl';

describe('asset.render.PreviewAppCtrl', () => {
  let mock$window;
  let mockCanvasEl;
  let mockContentEl;
  let mockCustomStyleEl;
  let mockDOMParserService;
  let mockHtml2canvasService;
  let ctrl;

  beforeEach(() => {
    mock$window = jasmine.createSpyObj('$window', ['addEventListener', 'setTimeout']);
    mockCanvasEl = jasmine.createSpyObj('CanvasEl', ['getContext', 'toDataURL']);
    mockContentEl = {};
    mockCustomStyleEl = {};
    mockDOMParserService = jasmine.createSpy('DOMParserService');
    mockHtml2canvasService = jasmine.createSpy('Html2canvasService');

    let fake$document = new FakeDocument({
      'canvas': mockCanvasEl,
      '#content': mockContentEl,
      'style#custom': mockCustomStyleEl
    });

    ctrl = new PreviewAppCtrl(
        [fake$document], mock$window, mockDOMParserService, mockHtml2canvasService);
  });

  it('should listen to message event from $window', () => {
    expect(mock$window.addEventListener).toHaveBeenCalledWith('message', jasmine.any(Function));
  });

  describe('onMessage_', () => {
    let onMessage_;

    beforeEach(() => {
      onMessage_ = mock$window.addEventListener.calls.argsFor(0)[1];
    });

    it('should render the content and send it back', () => {
      let data = {
        'content': 'content',
        'height': 123,
        'width': 456
      };
      let mockParsedStyleEl = { innerHTML: 'style innerHTML' };
      let mockParsedRootEl = { outerHTML: 'root outerHTML' };

      let fakeParsedDocument = new FakeDocument({
        'style': mockParsedStyleEl,
        '.root': mockParsedRootEl
      });
      let mockDOMParser = jasmine.createSpyObj('DOMParser', ['parseFromString']);
      mockDOMParser.parseFromString.and.returnValue(fakeParsedDocument);
      mockDOMParserService.and.returnValue(mockDOMParser);

      let event = {
        data: data,
        origin: 'origin',
        source: {
          postMessage: jasmine.createSpy('postMessage')
        }
      };
      onMessage_(event);

      // Trigger the timeout.
      expect(mock$window.setTimeout)
          .toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Number));
      mock$window.setTimeout.calls.argsFor(0)[0]();

      expect(mockDOMParser.parseFromString).toHaveBeenCalledWith(data['content'], 'text/html');
      expect(mockCustomStyleEl.innerHTML).toEqual(mockParsedStyleEl.innerHTML);
      expect(mockContentEl.innerHTML).toEqual(mockParsedRootEl.outerHTML);
      expect(mockHtml2canvasService).toHaveBeenCalledWith(mockContentEl, jasmine.objectContaining({
        'onrendered': jasmine.any(Function)
      }));

      let canvas = {};
      let mockContext = jasmine.createSpyObj('Context', ['drawImage']);
      mockCanvasEl.getContext.and.returnValue(mockContext);

      let dataUrl = 'dataUrl';
      mockCanvasEl.toDataURL.and.returnValue(dataUrl);

      // Triggers the onrendered handler.
      mockHtml2canvasService.calls.argsFor(0)[1]['onrendered'](canvas);

      expect(mockCanvasEl.getContext).toHaveBeenCalledWith('2d');
      expect(mockContext.drawImage)
          .toHaveBeenCalledWith(canvas, 0, 0, data['width'], data['height']);
      expect(mockCanvasEl.toDataURL).toHaveBeenCalledWith('image/png');
      expect(event.source.postMessage).toHaveBeenCalledWith(dataUrl, event.origin);
    });
  });
});
