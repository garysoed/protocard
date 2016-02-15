/**
 * #fileoverview Executes the given function when disposed.
 */
import Disposable from './disposable';


export default class DisposableFunction extends Disposable {
  private fn_: Function;

  constructor(fn: Function) {
    super();
    this.fn_ = fn;
  }

  /**
   * @override
   */
  disposeInternal(): void {
    this.run();
  }

  run(): void {
    this.fn_();
  }
}
