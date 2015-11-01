const __canvas__ = Symbol('canvas');
const __content__ = Symbol('content');
const __link__ = Symbol('link');

export default class {
  constructor($scope) {
    this[__canvas__] = null;
    this[__content__] = null;
    this[__link__] = null;
  }

  set canvas(canvas) {
    this[__canvas__] = canvas;
  }

  set content(content) {
    this[__content__] = content;
  }

  set link(link) {
    this[__link__] = link;
  }
}
