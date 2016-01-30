import TestBase from '../testbase';
TestBase.init();

import FakeDocument from '../testing/fake-document';
import PreviewAppCtrl from './preview-app-ctrl';

describe('render.PreviewAppCtrl', () => {
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

    let jqliteDoc = jasmine.cast<JQLite<Document>>([fake$document]);

    ctrl = new PreviewAppCtrl(
        jqliteDoc,
        mock$window,
        mockDOMParserService,
        mockHtml2canvasService);
  });

  it('should listen to message event from $window', () => {
    expect(mock$window.addEventListener).toHaveBeenCalledWith('message', jasmine.any(Function));
  });

  describe('onMessage_', () => {
    let onMessage_;
    let id = 'id';

    beforeEach(() => {
      onMessage_ = mock$window.addEventListener.calls.argsFor(0)[1];
    });

    it('should render the content and send it back', () => {
      let height = 123;
      let width = 456;
      let data = {
        'content': 'content',
        'height': height,
        'width': width,
        'id': id
      };
      let mockParsedStyleEl = jasmine.cast<HTMLElement>({ innerHTML: 'style innerHTML' });
      let mockParsedRootEl = jasmine.cast<HTMLElement>({ outerHTML: 'root outerHTML' });

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
      expect(mockCanvasEl.width).toEqual(width);
      expect(mockCanvasEl.height).toEqual(height);
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
          .toHaveBeenCalledWith(canvas, 0, 0, width, height);
      expect(mockCanvasEl.toDataURL).toHaveBeenCalledWith('image/png');
      expect(event.source.postMessage)
          .toHaveBeenCalledWith({ uri: dataUrl, id: id }, event.origin);
    });
  });
});
