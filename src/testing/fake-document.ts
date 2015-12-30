
export default class FakeDocument {
  private elements_: { [selector: string]: HTMLElement }

  constructor(elements: { [selector: string]: HTMLElement }) {
    this.elements_ = elements;
  }

  querySelector(selector: string): HTMLElement {
    return this.elements_[selector];
  }
};
