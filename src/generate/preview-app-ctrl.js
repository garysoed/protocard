// TODO(gs): Don't bother with symbols.

export default class {
  constructor($document, $window) {
    $window.addEventListener('message', this.onMessage_.bind(this));
    // TODO(gs): Use ID
    this.contentEl_ = $document[0].querySelector('.content');
    this.customStyleEl_ = $document[0].querySelector('style#custom');
    this.canvasEl_ = $document[0].querySelector('canvas');
  }

  onMessage_(event) {
    // TODO(gs): Check other types.
    let parser = new DOMParser();
    let doc = parser.parseFromString(event.data['data'], 'text/html');
    this.customStyleEl_.innerHTML = doc.querySelector('style').outerHTML;
    this.contentEl_.innerHTML = doc.querySelector('.root').outerHTML;
  }

  onGrabClick() {
    html2canvas(this.contentEl_, {
      onrendered: (canvas) => {
        var ctx = this.canvasEl_.getContext('2d');
        ctx.drawImage(canvas, 0, 0, 825, 1125);
        var dataUri = this.canvasEl_.toDataURL('image/png');
        this.contentEl_.style.transform = 'scale(.3)';
        this.contentEl_.style.transformOrigin = 'top left';
      }
    });
  }
};
