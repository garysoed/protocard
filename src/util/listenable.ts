import Disposable from './disposable';
import DisposableFunction from './disposable-function';


export default class Listenable<T> extends Disposable {
  private callbacksMap_: Map<T, ((any) => void)[]>;

  constructor() {
    super();
    this.callbacksMap_ = new Map();
  }

  /**
   * @override
   */
  disposeInternal() {
    this.callbacksMap_.clear();
  }

  dispatch(eventType: T, payload = null) {
    let callbacks = this.callbacksMap_.get(eventType);
    if (!!callbacks) {
      callbacks.forEach(callback => {
        window.setTimeout(() => {
          callback(payload);
        }, 0);
      });
    }
  }

  on(eventType: T, callback: (any) => void): DisposableFunction {
    if (!this.callbacksMap_.has(eventType)) {
      this.callbacksMap_.set(eventType, []);
    }
    let callbacks = this.callbacksMap_.get(eventType);
    let index = callbacks.length;
    callbacks.push(callback);
    return new DisposableFunction(() => {
      callbacks.splice(index, 1);
    });
  }
}
