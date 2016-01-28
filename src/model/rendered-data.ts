import RequestTicket from '../util/request-ticket';

export default class RenderedData {
  private dataUriTicket_: RequestTicket<string>;
  private htmlSource_: string;

  constructor(dataUriTicket: RequestTicket<string>, htmlSource: string) {
    this.dataUriTicket_ = dataUriTicket;
    this.htmlSource_ = htmlSource;
  }

  get dataUriTicket(): RequestTicket<string> {
    return this.dataUriTicket_;
  }

  get htmlSource(): string {
    return this.htmlSource_;
  }
};
