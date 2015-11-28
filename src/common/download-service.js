export default class {
  /**
   * @constructor
   * @param {Document} $document
   * @param {Window} $window
   */
  constructor($document, $window) {
    this.$window_ = $window;
    this.document_ = $document[0];
    this.linkEl_ = null;
  }

  /**
   * @property linkEl
   * @type {Element}
   */
  get linkEl() {
    if (this.linkEl_ === null) {
      this.linkEl_ = this.document_.createElement('a');
      this.linkEl_.target = '_blank';
    }
    return this.linkEl_;
  }

  /**
   * Downloads the given blob with the given filename.
   *
   * @method download
   * @param {Blob} blob
   * @param {string} filename
   */
  download(blob, filename) {
    let url = this.$window_.URL.createObjectURL(blob);
    this.linkEl.download = filename;
    this.linkEl.href = url;
    this.linkEl.click();
    this.$window_.URL.revokeObjectURL(url);
  }
};
