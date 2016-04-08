import BaseDisposable from '../../node_modules/gs-tools/src/dispose/base-disposable';
import DomServiceModule from '../thirdparty/dom-service';
import Html2canvasServiceModule from '../thirdparty/html2canvas-service';
import PostMessageChannel from '../../node_modules/gs-tools/src/ui/post-message-channel';


export class PreviewAppCtrl extends BaseDisposable {
  private $window_: Window;
  private canvasEl_: HTMLCanvasElement;
  private contentEl_: HTMLElement;
  private customStyleEl_: HTMLElement;
  private domParserService_: DOMParser;
  private html2canvasService_: Html2CanvasStatic;
  private postMessageChannelPromise_: Promise<PostMessageChannel>;

  constructor(
      $document: JQLite<Document>,
      $window: Window,
      DOMParserService: DOMParser,
      Html2canvasService: Html2CanvasStatic) {
    super();
    this.$window_ = $window;
    this.canvasEl_ = <HTMLCanvasElement> ($document[0].querySelector('canvas'));
    this.contentEl_ = <HTMLElement> ($document[0].querySelector('#content'));
    this.customStyleEl_ = <HTMLElement> ($document[0].querySelector('style#custom'));
    this.domParserService_ = DOMParserService;
    this.html2canvasService_ = Html2canvasService;

    this.postMessageChannelPromise_ = PostMessageChannel
        .listen($window, PostMessageChannel.getOrigin($window))
        .then((channel: PostMessageChannel) => {
          this.addDisposable(channel);
          channel.waitForMessage(this.onMessage_.bind(this, channel));
          return channel;
        });
  }

  /**
   * Handler called when there is a message event dispatched by the window.
   */
  private onMessage_(channel: PostMessageChannel, data: gs.IJson): boolean {
    let content = data['content'];
    let height = data['height'];
    let width = data['width'];
    let id = data['id'];

    let parser = new this.domParserService_();
    let doc = parser.parseFromString(content, 'text/html');
    this.customStyleEl_.innerHTML = (<HTMLElement> (doc.querySelector('style'))).innerHTML;
    this.contentEl_.innerHTML = (<HTMLElement> (doc.querySelector('.root'))).outerHTML;
    this.canvasEl_.width = width;
    this.canvasEl_.height = height;

    this.$window_.setTimeout(() => {
      this.html2canvasService_(this.contentEl_, {
        'useCORS': true,
        'onrendered': (canvas: HTMLCanvasElement): void => {
          let ctx = this.canvasEl_.getContext('2d');
          ctx.drawImage(canvas, 0, 0, width, height);
          let dataUri = this.canvasEl_.toDataURL('image/png');
          channel.post({ id: id, uri: dataUri });
        },
      });
    }, 100);

    return false;
  }
};

angular
    .module('pc.PreviewApp', [
      'ngMaterial',
      'ngRoute',
      DomServiceModule.name,
      Html2canvasServiceModule.name,
    ])
    .config(($routeProvider: any) => {
      $routeProvider.otherwise(
          {
            controller: PreviewAppCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'src/render/preview-app.ng',
          });
    });
