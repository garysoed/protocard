import BaseService from '../../node_modules/gs-tools/src/ng/base-service';
import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import PostMessageChannel from '../../node_modules/gs-tools/src/ui/post-message-channel';
import RequestPool from '../util/request-pool';
import RequestTicket from '../util/request-ticket';


interface IParams {
  content: string;
  width: number;
  height: number;
}

export class RenderService extends BaseService<void> {
  private $window_: Window;
  private document_: Document;
  private iframeElPromise_: Promise<HTMLIFrameElement>;
  private requestPool_: RequestPool<IParams, string>;

  constructor($document: JQLite<Document>, $window: Window) {
    super($window);
    this.$window_ = $window;
    this.document_ = $document[0];
    this.iframeElPromise_ = null;
    this.requestPool_ = new RequestPool<IParams, string>(this.onRequest_.bind(this));
  }

  @Cache()
  private get iframeElChannelPromise_(): Promise<PostMessageChannel> {
    return this.iframeElPromise
        .then((iframeEl: HTMLIFrameElement) => {
          return PostMessageChannel.open(this.$window_, iframeEl.contentWindow);
        })
        .then((channel: PostMessageChannel) => {
          this.addDisposable(channel);
          return channel;
        })
  }

  /**
   * Handler called when the request pool is executing a request.
   */
  private onRequest_(params: IParams): Promise<string> {
    let content = params.content;
    let width = params.width;
    let height = params.height;

    return Promise
        .all<any>([
          this.iframeElPromise,
          this.iframeElChannelPromise_,
        ])
        .then((results: any[]) => {
          let iframeEl: HTMLIFrameElement = results[0];
          let messageChannel: PostMessageChannel = results[1]
          let id = Math.random();

          iframeEl.style.width = `${width}px`;
          iframeEl.style.height = `${height}px`;

          messageChannel.post({
            'content': content,
            'height': height,
            'width': width,
            'id': id,
          });

          return messageChannel
              .waitForMessage((data: gs.IJson) => {
                return data['id'] === id;
              })
              .then((data: gs.IJson) => {
                return data['uri'];
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
