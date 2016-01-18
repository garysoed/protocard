export default class FakeScope {
  constructor(values: { [key: string]: any } = {}) {
    for (let key in values) {
      this[key] = values[key];
    }
  }

  $apply() {}
  $emit() {}
  $on() {}
};
