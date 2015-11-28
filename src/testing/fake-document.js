export default class {
  constructor(elements) {
    this.elements_ = elements;
  }

  querySelector(selector) {
    return this.elements_[selector];
  }
};
