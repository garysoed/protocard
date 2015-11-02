export const __height__ = Symbol('height');

/**
 * @class common.AccordionCtrl
 */
export default class {
  /**
   * @constructor
   */
  constructor() {
    this.isExpanded_ = true;
    this.contentEl_ = null;
  }

  /**
   * Updates the height of the content.
   *
   * @method updateHeight_
   * @private
   */
  updateHeight_() {
    if (!this.contentEl_) {
      throw Error('No content element found. Have you called onLink?');
    }
    this.contentEl_.style.height = this.isExpanded_ ? this.contentEl_[__height__] : '0';
  }

  /**
   * @property isExpanded
   * @type {Boolean} True iff the accordion is expanded.
   */
  get isExpanded() {
    return this.isExpanded_;
  }

  /**
   * Handler called when the header is clicked.
   *
   * @method onHeaderClick
   */
  onHeaderClick() {
    this.isExpanded_ = !this.isExpanded_;
    this.updateHeight_();
  }

  /**
   * Handler called when the controller is linked.
   *
   * @method onLink
   * @param {Element} contentEl The content element.
   */
  onLink(contentEl) {
    this.contentEl_ = contentEl;
    this.contentEl_[__height__] = `${contentEl.getBoundingClientRect().height}px`;
    this.updateHeight_();
  }
}
