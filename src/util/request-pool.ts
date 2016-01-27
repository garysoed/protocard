export default class RequestPool<P> {
  private callbackFn_: (P) => Promise<any>;
  private queue_: Promise<any>[];

  /**
   * @constructor
   * @param callbackFn Function to call for getting a request. The function takes in a
   *    parameter object and returns a promise that will be resolved when the request is complete.
   */
  constructor(callbackFn: (params: P) => Promise<any>) {
    this.callbackFn_ = callbackFn;
    this.queue_ = [];
  }

  /**
   * Queues up a request with the given parameter object.
   * @param params Object to be passed to the callback function.
   * @return Promise that will be resolved when the request has been fulfilled.
   */
  queue(params: P): Promise<any> {
    let promise;
    if (this.queue_.length === 0) {
      promise = this.callbackFn_(params)
          .then(value => {
            this.queue_.shift();
            return value;
          });
    } else {
      let lastPromise = this.queue_[this.queue_.length - 1];
      promise = lastPromise
          .then(() => this.callbackFn_(params))
          .then(value => {
            this.queue_.shift();
            return value;
          });
    }
    this.queue_.push(promise);
    return promise;
  }
};
