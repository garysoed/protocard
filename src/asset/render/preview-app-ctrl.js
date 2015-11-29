export default class {

  /**
   * @constructor
   * @param {Document} $document
   * @param {Window} $window
   * @param {DOMParser} DOMParserService
   * @param {thirdparty.html2canvas} Html2canvasService
   */
  constructor($document, $window, DOMParserService, Html2canvasService) {
    this.$window_ = $window;
    this.canvasEl_ = $document[0].querySelector('canvas');
    this.contentEl_ = $document[0].querySelector('#content');
    this.customStyleEl_ = $document[0].querySelector('style#custom');
    this.domParserService_ = DOMParserService;
    this.html2canvasService_ = Html2canvasService;

    $window.addEventListener('message', this.onMessage_.bind(this));
  }

  /**
   * Handler called when there is a message event dispatched by the window.
   *
   * @method onMessage_
   * @param {Event} event
   * @private
   */
  onMessage_(event) {
    let content = event.data['content'];
    let height = event.data['height'];
    let width = event.data['width'];

    let parser = new this.domParserService_();
    let doc = parser.parseFromString(content, 'text/html');
    this.customStyleEl_.innerHTML = doc.querySelector('style').innerHTML;
    this.contentEl_.innerHTML = doc.querySelector('.root').outerHTML;

    // TODO(gs): Wait until everything is rendered.
    this.$window_.setTimeout(() => {
      this.html2canvasService_(this.contentEl_, {
        'useCORS': true,
        'onrendered': (canvas) => {
          var ctx = this.canvasEl_.getContext('2d');
          ctx.drawImage(canvas, 0, 0, width, height);
          var dataUri = this.canvasEl_.toDataURL('image/png');
          event.source.postMessage(dataUri, event.origin);
        }
      });
    }, 100);
  }
};
