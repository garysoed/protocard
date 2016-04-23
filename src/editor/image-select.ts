import ImageResource from '../model/image-resource';

/**
 * Controller for displaying and selecting images.
 */
export class ImageSelectCtrl {
  private images_: ImageResource[];
  private ngModel_: angular.INgModelController;

  get images(): ImageResource[] {
    return this.images_;
  }
  set images(images: ImageResource[]) {
    this.images_ = images;
  }

  /**
   * @param image Image to check if it is selected
   * @return True iff the given image is selected.
   */
  isSelected(image: ImageResource): boolean {
    return this.ngModel_.$viewValue.indexOf(image) >= 0;
  }

  get ngModel(): angular.INgModelController {
    return this.ngModel_;
  }
  set ngModel(ngModel: angular.INgModelController) {
    this.ngModel_ = ngModel;
  }

  /**
   * Selects / unselects the given image.
   * @param image The Image to be selected / unselected. If it is selected, the image will be
   *    unselected, and vice versa.
   */
  select(image: ImageResource): void {
    if (this.isSelected(image)) {
      let index = this.ngModel_.$viewValue.indexOf(image);
      this.ngModel_.$viewValue.splice(index, 1);
    } else {
      this.ngModel_.$viewValue.push(image);
    }
  }

  /**
   * @param image The image whose CSS class should be returned.
   * @return CSS class for the given image.
   */
  selectedCssFor(image: ImageResource): string {
    return this.isSelected(image) ? 'selected' : '';
  }
}

export default angular
    .module('editor.ImageSelectModule', [])
    .component('pcImageSelect', {
      bindings: {
        'images': '<',
      },
      controller: ImageSelectCtrl,
      require: {
        'ngModel': 'ngModel',
      },
      templateUrl: 'src/editor/image-select.ng',
    });
