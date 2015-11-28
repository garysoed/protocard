/**
 * Controller for displaying and selecting images.
 *
 * @class editor.ImageSelectCtrl
 */
export default class {
  /**
   * @constructor
   */
  constructor($scope) {
    this.$scope_ = $scope;
    this.ngModelCtrl_ = null;
  }

  /**
   * @property images
   * @type Array
   * @readonly
   */
  get images() {
    return this.$scope_['images'];
  }

  /**
   * @method isSelected
   * @param {ImageResource} image Image to check if it is selected
   * @return {Boolean} True iff the given image is selected.
   */
  isSelected(image) {
    return this.ngModelCtrl_.$viewValue.indexOf(image) >= 0;
  }

  /**
   * Selects / unselects the given image.
   *
   * @method select
   * @param {ImageResource} image The Image to be selected / unselected. If it is selected, the
   *    image will be unselected, and vice versa.
   */
  select(image) {
    if (this.isSelected(image)) {
      let index = this.ngModelCtrl_.$viewValue.indexOf(image);
      this.ngModelCtrl_.$viewValue.splice(index, 1);
    } else {
      this.ngModelCtrl_.$viewValue.push(image);
    }
  }

  /**
   * @method selectedCssFor
   * @param {ImageResource} image The image whose CSS class should be returned.
   * @return {string} CSS class for the given image.
   */
  selectedCssFor(image) {
    return this.isSelected(image) ? 'selected' : '';
  }

  /**
   * Called during linking.
   *
   * @method onLink
   * @param {ng.NgModelCtrl} ngModelCtrl
   */
  onLink(ngModelCtrl) {
    this.ngModelCtrl_ = ngModelCtrl;
  }
}
