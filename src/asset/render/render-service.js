export default class {
  /**
   * @constructor
   * @param {Document} $document
   * @param {Window} $window
   */
  constructor($document, $window) {
    this.$window_ = $window;
    this.document_ = $document[0];
    this.iframeElPromise_ = null;
    this.runningRenderPromise_ = null;
  }

  hasOngoingRendering() {
    return this.runningRenderPromise_ !== null;
  }

  /**
   * @method iframeElPromise
   * @return {Promise} Promise that will be resolved with the iframe element when the iframe has
   *    finished loading.
   */
  get iframeElPromise() {
    if (this.iframeElPromise_ === null) {
      this.iframeElPromise_ = new Promise((resolve, reject) => {
        let iframeEl = this.document_.createElement('iframe');
        iframeEl.style.visibility = 'hidden';
        iframeEl.style.position = 'fixed';
        iframeEl.src = 'asset/render/preview-app.html';
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
   * @method render
   * @param {string} content HTML string of content to render.
   * @param {number} width Width, in pixels, of the content to render.
   * @param {number} height Height, in pixels, of the content to render.
   * @return {Promise} Promise that will be resolved with the data URI when the rendering is done.
   */
  render(content, width, height) {
    if (this.hasOngoingRendering()) {
      throw Error('A rendering process is currently running');
    }
    this.runningRenderPromise_ = this.iframeElPromise
        .then(iframeEl => {
          // TODO(gs): Cache this.
          let location = this.$window_.location;
          let origin = `${location.protocol}//${location.host}`;
          return new Promise((resolve, reject) => {
            let messageHandler = event => {
              this.$window_.removeEventListener('message', messageHandler);
              if (event.origin !== origin) {
                return;
              }
              this.runningRenderPromise_ = null;
              resolve(event.data);
            };
            this.$window_.addEventListener('message', messageHandler);

            iframeEl.style.width = `${width}px`;
            iframeEl.style.height = `${height}px`;
            iframeEl.contentWindow.postMessage(
                {
                  'content': content,
                  'height': height,
                  'width': width
                },
                origin);
          });
        });
    return this.runningRenderPromise_;
  }
};
