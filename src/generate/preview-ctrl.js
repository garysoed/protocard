const __canvas__ = Symbol('canvas');
const __content__ = Symbol('content');
const __link__ = Symbol('link');

export default class {
  constructor($scope, $window) {
    this.$scope_ = $scope;
    this.iframeEl_ = null;
    this.dataUrl_ = null;
    this[__canvas__] = null;
    this[__content__] = null;
    this[__link__] = null;

    $window.addEventListener('message', this.onMessage_.bind(this));
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

  onLink(iframeEl) {
    this.iframeEl_ = iframeEl;
    iframeEl.addEventListener('load', () => {
      // TODO(gs): Build flag to the origin.
      iframeEl.contentWindow.postMessage({
        'type': 'render',
        'data': this.$scope_['content']
      }, 'http://localhost:8080');
    });
  }

  onMessage_(event) {
    if (event.origin !== "http://localhost:8080") {
      return;
    }
    this.iframeEl_.style.width = '275px';
    this.iframeEl_.style.height = '375px';
    this.dataUrl_ = event.data;
    this.$scope_.$emit('progress');
  }
}
