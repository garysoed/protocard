import ImageResource from '../model/image-resource';

/**
 * Controller for displaying and selecting images.
 */
export default class {
  private $scope_: angular.IScope;
  private ngModelCtrl_: angular.INgModelController;

  constructor($scope: angular.IScope) {
    this.$scope_ = $scope;
    this.ngModelCtrl_ = null;
  }

  get images(): ImageResource[] {
    return this.$scope_['images'];
  }

  /**
   * @param image Image to check if it is selected
   * @return True iff the given image is selected.
   */
  isSelected(image: ImageResource): boolean {
    return this.ngModelCtrl_.$viewValue.indexOf(image) >= 0;
  }

  /**
   * Selects / unselects the given image.
   * @param image The Image to be selected / unselected. If it is selected, the image will be
   *    unselected, and vice versa.
   */
  select(image: ImageResource) {
    if (this.isSelected(image)) {
      let index = this.ngModelCtrl_.$viewValue.indexOf(image);
      this.ngModelCtrl_.$viewValue.splice(index, 1);
    } else {
      this.ngModelCtrl_.$viewValue.push(image);
    }
  }

  /**
   * @param image The image whose CSS class should be returned.
   * @return CSS class for the given image.
   */
  selectedCssFor(image: ImageResource): string {
    return this.isSelected(image) ? 'selected' : '';
  }

  /**
   * Called during linking.
   *
   * @param ngModelCtrl
   */
  onLink(ngModelCtrl: angular.INgModelController) {
    this.ngModelCtrl_ = ngModelCtrl;
  }
}
