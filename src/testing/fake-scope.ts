import DisposableFunction from '../util/disposable-function';

export default class FakeScope {
  constructor(values: { [key: string]: any } = {}) {
    for (let key in values) {
      this[key] = values[key];
    }
  }

  $apply() {}
  $emit() {}
  $on() {
    let disposableFunction = new DisposableFunction(() => undefined);
    return () => {
      disposableFunction.dispose();
    };
  }
};
