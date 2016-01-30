import RequestTicket from './request-ticket';
import Runner from './runner';

export default class RequestPool<P, R> {
  private callbackFn_: (P) => R;
  private queue_: Promise<any>[];

  /**
   * @constructor
   * @param callbackFn Function to call for getting a request. The function takes in a
   *    parameter object and returns a promise that will be resolved when the request is complete.
   */
  constructor(callbackFn: (params: P) => R) {
    this.callbackFn_ = callbackFn;
    this.queue_ = [];
  }

  /**
   * Queues up a request with the given parameter object.
   * @param params Object to be passed to the callback function.
   * @return Promise that will be resolved when the request has been fulfilled.
   */
  queue(params: P): RequestTicket<R> {
    let runner = new Runner<P, R>(this.callbackFn_);
    let ticket = new RequestTicket<R>(runner);
    let promise;
    if (this.queue_.length === 0) {
      runner.run(params);
      promise = ticket.promise
          .then(value => {
            this.queue_.shift();
            return value;
          });
    } else {
      let lastPromise = this.queue_[this.queue_.length - 1];
      promise = lastPromise
          .then(() => {
            if (ticket.active) {
              runner.run(params);
            }
            return ticket.promise;
          })
          .then(value => {
            this.queue_.shift();
            return value;
          });
    }
    this.queue_.push(promise);
    return ticket;
  }
};
