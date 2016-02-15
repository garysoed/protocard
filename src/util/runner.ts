/**
 * @fileoverview Wrapper for a function. Keeps track of the result or error as a result of running
 * the function.
 */
export default class Runner<P, R> {
  private error_: Error;
  private callback_: (data: P) => R;
  private ran_: boolean;
  private result_: R;

  constructor(callback: (data: P) => R) {
    this.error_ = undefined;
    this.callback_ = callback;
    this.ran_ = false;
    this.result_ = undefined;
  }

  get error(): Error {
    return this.error_;
  }

  get ran(): boolean {
    return this.ran_;
  }

  get result(): R {
    return this.result_;
  }

  run(params: P): void {
    if (this.ran_) {
      throw Error(`Cannot rerun the runner. It has already ran`);
    }

    try {
      this.result_ = this.callback_(params);
    } catch (e) {
      this.error_ = e;
    } finally {
      this.ran_ = true;
    }
  }
}
