import RequestPool from '../util/request-pool';
import RequestTicket from '../util/request-ticket';

interface IParams {
  content: string;
  width: number;
  height: number;
}

export class RenderService {
  private $window_: Window;
  private document_: Document;
  private iframeElPromise_: Promise<HTMLIFrameElement>;
  private requestPool_: RequestPool<IParams, string>;

  constructor($document: JQLite<Document>, $window: Window) {
    this.$window_ = $window;
    this.document_ = $document[0];
    this.iframeElPromise_ = null;
    this.requestPool_ = new RequestPool<IParams, string>(this.onRequest_.bind(this));
  }

  /**
   * Handler called when the request pool is executing a request.
   */
  private onRequest_(params: IParams): Promise<string> {
    let content = params.content;
    let width = params.width;
    let height = params.height;

    return this.iframeElPromise
        .then((iframeEl: HTMLIFrameElement) => {
          // TODO(gs): Cache this.
          let location = this.$window_.location;
          let origin = `${location.protocol}//${location.host}`;
          return new Promise((resolve: (data: any) => void, reject: (data: any) => void) => {
            let id = Math.random();
            let messageHandler = (event: any) => {
              if (event.origin !== origin) {
                return;
              }

              if (event.data.id !== id) {
                return;
              }
              this.$window_.removeEventListener('message', messageHandler);
              resolve(event.data.uri);
            };
            this.$window_.addEventListener('message', messageHandler);

            iframeEl.style.width = `${width}px`;
            iframeEl.style.height = `${height}px`;
            iframeEl.contentWindow.postMessage(
                {
                  'content': content,
                  'height': height,
                  'width': width,
                  'id': id,
                },
                origin);
          });
        });
  }

  /**
   * @return Promise that will be resolved with the iframe element when the iframe has
   *    finished loading.
   */
  get iframeElPromise(): Promise<HTMLIFrameElement> {
    if (this.iframeElPromise_ === null) {
      this.iframeElPromise_ = new Promise(
          (resolve: (data: any) => void, reject: (data: any) => void) => {
            let iframeEl = this.document_.createElement('iframe');
            iframeEl.style.visibility = 'hidden';
            iframeEl.style.position = 'fixed';
            iframeEl.style.top = '0';
            iframeEl.src = 'src/render/preview-app.html';
            iframeEl.addEventListener('load', () => {
              resolve(iframeEl);
            });

            this.document_.body.appendChild(iframeEl);
          });
    }
    return this.iframeElPromise_;
  }

  /**
   * Renders the given content and returns back a data URI. This will throw an exception if it has
   * an ongoing rendering process.
   *
   * @param content HTML string of content to render.
   * @param width Width, in pixels, of the content to render.
   * @param height Height, in pixels, of the content to render.
   * @return Promise that will be resolved with the data URI when the rendering is done.
   */
  render(content: string, width: number, height: number): RequestTicket<string> {
    return this.requestPool_.queue({
      content: content,
      height: height,
      width: width,
    });
  }
};

export default angular
    .module('render.RenderServiceModule', [])
    .service('RenderService', RenderService);
