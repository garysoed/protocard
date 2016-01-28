import Runner from './runner';

export default class RequestTicket<R> {
  private active_: boolean;
  private runner_: Runner<any, R>;
  private promise_: Promise<R>;

  constructor(runner: Runner<any, R>) {
    this.active_ = true;
    this.runner_ = runner;
    this.promise_ = new Promise((resolve, reject) => {
      this.tryResolve_(resolve, reject);
    });
  }

  get active(): boolean {
    return this.active_;
  }
  set active(active: boolean) {
    this.active_ = active;
  }

  private tryResolve_(resolve, reject) {
    if (!this.active) {
      return;
    }

    if (this.runner_.ran) {
      if (this.runner_.error !== undefined) {
        reject(this.runner_.error);
      } else {
        resolve(this.runner_.result);
      }
    } else {
      window.setTimeout(() => {
        this.tryResolve_(resolve, reject);
      }, 0);
    }
  }

  get promise(): Promise<R> {
    return this.promise_;
  }
}
