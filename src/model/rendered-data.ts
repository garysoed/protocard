export default class RenderedData {
  private dataUriPromise_: Promise<string>;
  private htmlSource_: string;

  constructor(dataUriPromise: Promise<string>, htmlSource: string) {
    this.dataUriPromise_ = dataUriPromise;
    this.htmlSource_ = htmlSource;
  }

  get dataUriPromise(): Promise<string> {
    return this.dataUriPromise_;
  }

  get htmlSource(): string {
    return this.htmlSource_;
  }
};
