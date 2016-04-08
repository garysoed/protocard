import TestBase from '../testbase';
TestBase.init();

import FakeDocument from '../testing/fake-document';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';
import PostMessageChannel from '../../node_modules/gs-tools/src/ui/post-message-channel';
import { PreviewAppCtrl } from './preview-app';
import TestDispose from '../../node_modules/gs-tools/src/testing/test-dispose';

describe('render.PreviewAppCtrl', () => {
  let mock$window;
  let mockCanvasEl;
  let mockContentEl;
  let mockCustomStyleEl;
  let mockDOMParserService;
  let mockHtml2canvasService;
  let mockPostMessageChannel;
  let ctrl;

  beforeEach(() => {
    mock$window = jasmine.createSpyObj('$window', ['addEventListener', 'setTimeout']);
    mock$window.location = { host: 'host', protocol: 'protocol' };
    mockCanvasEl = jasmine.createSpyObj('CanvasEl', ['getContext', 'toDataURL']);
    mockContentEl = {};
    mockCustomStyleEl = {};
    mockDOMParserService = jasmine.createSpy('DOMParserService');
    mockHtml2canvasService = jasmine.createSpy('Html2canvasService');
    mockPostMessageChannel = Mocks.disposable();
    mockPostMessageChannel.post = jasmine.createSpy('post');
    mockPostMessageChannel.waitForMessage = jasmine.createSpy('waitForMessage');

    let fake$document = new FakeDocument({
      'canvas': mockCanvasEl,
      '#content': mockContentEl,
      'style#custom': mockCustomStyleEl,
    });

    let jqliteDoc = jasmine.cast<JQLite<Document>>([fake$document]);

    spyOn(PostMessageChannel, 'listen').and.returnValue(Promise.resolve(mockPostMessageChannel));

    ctrl = new PreviewAppCtrl(
        jqliteDoc,
        mock$window,
        mockDOMParserService,
        mockHtml2canvasService);
    TestDispose.add(ctrl);
  });

  it('should open the post message channel correctly', (done: any) => {
    expect(PostMessageChannel.listen).toHaveBeenCalledWith(
        mock$window,
        `${mock$window.location.protocol}//${mock$window.location.host}`);
    ctrl['postMessageChannelPromise_']
        .then((channel: PostMessageChannel) => {
          expect(channel).toEqual(mockPostMessageChannel);
          expect(mockPostMessageChannel.waitForMessage).toHaveBeenCalledWith(jasmine.any(Function));
          done();
        }, done.fail);
  });

  describe('onMessage_', () => {
    let onMessage_;
    let id = 'id';

    beforeEach((done: any) => {
      ctrl['postMessageChannelPromise_']
          .then(() => {
            onMessage_ = mockPostMessageChannel.waitForMessage.calls.argsFor(0)[0];
            done();
          }, done.fail);
    });

    it('should render the content and send it back', () => {
      let height = 123;
      let width = 456;
      let data = {
        'content': 'content',
        'height': height,
        'width': width,
        'id': id,
      };
      let mockParsedStyleEl = jasmine.cast<HTMLElement>({ innerHTML: 'style innerHTML' });
      let mockParsedRootEl = jasmine.cast<HTMLElement>({ outerHTML: 'root outerHTML' });

      let fakeParsedDocument = new FakeDocument({
        'style': mockParsedStyleEl,
        '.root': mockParsedRootEl,
      });
      let mockDOMParser = jasmine.createSpyObj('DOMParser', ['parseFromString']);
      mockDOMParser.parseFromString.and.returnValue(fakeParsedDocument);
      mockDOMParserService.and.returnValue(mockDOMParser);

      onMessage_(data);

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
      expect(mockPostMessageChannel.post)
          .toHaveBeenCalledWith({ id: id, uri: dataUrl });
    });
  });
});
