export default class DownloadService {
  private $window_: Window;
  private document_: Document;
  private linkEl_: HTMLAnchorElement;

  constructor($document: JQLite<Document>, $window: Window) {
    this.$window_ = $window;
    this.document_ = $document[0];
    this.linkEl_ = null;
  }

  get linkEl(): HTMLAnchorElement {
    if (this.linkEl_ === null) {
      this.linkEl_ = this.document_.createElement('a');
      this.linkEl_.target = '_blank';
    }
    return this.linkEl_;
  }

  /**
   * Downloads the given blob with the given filename.
   *
   * @param blob The blob to download.
   * @param filename The filename to download the blob as.
   */
  download(blob: Blob, filename: string): void {
    let url = this.$window_.URL.createObjectURL(blob);
    this.linkEl.download = filename;
    this.linkEl.href = url;
    this.linkEl.click();
    this.$window_.URL.revokeObjectURL(url);
  }
};
