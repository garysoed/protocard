// TODO(gs): Don't bother with symbols.

export default class {
  constructor($document, $window) {
    this.$window_ = $window;
    // TODO(gs): Use ID
    this.contentEl_ = $document[0].querySelector('.content');
    this.customStyleEl_ = $document[0].querySelector('style#custom');
    this.canvasEl_ = $document[0].querySelector('canvas');
    this.appEl_ = $document[0].querySelector('.app');
    this.rootEl_ = $document[0].querySelector('[ng-view]');
  }

  onMessage_(event) {
    // TODO(gs): Check other types.
    let parser = new DOMParser();
    let doc = parser.parseFromString(event.data['data'], 'text/html');
    this.customStyleEl_.innerHTML = doc.querySelector('style').outerHTML;
    this.contentEl_.innerHTML = doc.querySelector('.root').outerHTML;

    html2canvas(this.contentEl_, {
      onrendered: (canvas) => {
        var ctx = this.canvasEl_.getContext('2d');
        ctx.drawImage(canvas, 0, 0, 825, 1125);
        var dataUri = this.canvasEl_.toDataURL('image/png');
        this.canvasEl_.style.display = 'none';
        this.contentEl_.style.transform = 'scale(.333)';
        this.contentEl_.style.transformOrigin = 'top left';
        this.appEl_.style.height = `375px`;
        this.rootEl_.style.height = '375px';

        event.source.postMessage(dataUri, event.origin);
      }
    });
  }

  onInit() {
    this.$window_.addEventListener('message', this.onMessage_.bind(this));
  }
};
