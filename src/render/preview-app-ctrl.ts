export default class PreviewAppCtrl {

  private $window_: Window;
  private canvasEl_: HTMLCanvasElement;
  private contentEl_: HTMLElement;
  private customStyleEl_: HTMLElement;
  private domParserService_: DOMParser;
  private html2canvasService_: Html2CanvasStatic;

  constructor(
      $document: JQLite<Document>,
      $window: Window,
      DOMParserService: DOMParser,
      Html2canvasService: Html2CanvasStatic) {
    this.$window_ = $window;
    this.canvasEl_ = <HTMLCanvasElement>($document[0].querySelector('canvas'));
    this.contentEl_ = <HTMLElement>($document[0].querySelector('#content'));
    this.customStyleEl_ = <HTMLElement>($document[0].querySelector('style#custom'));
    this.domParserService_ = DOMParserService;
    this.html2canvasService_ = Html2canvasService;

    $window.addEventListener('message', this.onMessage_.bind(this));
  }

  /**
   * Handler called when there is a message event dispatched by the window.
   */
  private onMessage_(event: MessageEvent) {
    let content = event.data['content'];
    let height = event.data['height'];
    let width = event.data['width'];
    let id = event.data['id'];

    let parser = new this.domParserService_();
    let doc = parser.parseFromString(content, 'text/html');
    this.customStyleEl_.innerHTML = (<HTMLElement>(doc.querySelector('style'))).innerHTML;
    this.contentEl_.innerHTML = (<HTMLElement>(doc.querySelector('.root'))).outerHTML;

    // TODO(gs): Wait until everything is rendered.
    this.$window_.setTimeout(() => {
      this.html2canvasService_(this.contentEl_, {
        'useCORS': true,
        'onrendered': (canvas) => {
          var ctx = this.canvasEl_.getContext('2d');
          ctx.drawImage(canvas, 0, 0, width, height);
          var dataUri = this.canvasEl_.toDataURL('image/png');
          event.source.postMessage({ uri: dataUri, id: id }, event.origin);
        }
      });
    }, 100);
  }
};
