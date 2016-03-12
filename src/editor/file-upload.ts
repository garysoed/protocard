import File from '../model/file';

export class FileUploadCtrl {
  private $window_: Window;
  private classes_: string;
  private extensions_: string;
  private inputEl_: HTMLInputElement;
  private ngModelCtrl_: angular.INgModelController;

  constructor($scope: angular.IScope, $window: Window) {
    this.$window_ = $window;
    this.classes_ = $scope['classes'];
    this.extensions_ = $scope['extensions'];
    this.inputEl_ = null;
    this.ngModelCtrl_ = null;
  }

  /**
   * Handler called when the is a change event on the input element.
   */
  private onFileChange_(): void {
    let file = this.inputEl_.files[0];
    let fileReader = new this.$window_['FileReader']();
    fileReader.addEventListener('loadend', () => {
      let fileObj = new File(File.getType(file.name), fileReader.result);
      this.ngModelCtrl_.$setViewValue(fileObj);
    });
    fileReader.readAsText(file);
  }

  /**
   * @return Additional classes to be applied to the file upload button.
   */
  get classes(): string {
    return this.classes_;
  }

  /**
   * @return File extensions to be applied to the file upload input.
   */
  get extensions(): string {
    return this.extensions_;
  }

  /**
   * Method called when linking the file upload.
   *
   * @param inputEl The input element for the file upload.
   * @param ngModelCtrl Angular's ngModelCtrl.
   */
  onLink(inputEl: HTMLInputElement, ngModelCtrl: angular.INgModelController): void {
    this.inputEl_ = inputEl;
    this.ngModelCtrl_ = ngModelCtrl;
    inputEl.addEventListener('change', this.onFileChange_.bind(this));
  }

  /**
   * Handler called when the upload button is clicked.
   */
  onUploadClick(): void {
    this.inputEl_.click();
  }
}

function link(
    scope: angular.IScope,
    element: angular.IAugmentedJQuery,
    attr: angular.IAttributes,
    ctrls: any[],
    transclude: angular.ITranscludeFunction): void {
  let [fileUploadCtrl, ngModelCtrl] = ctrls;
  fileUploadCtrl.onLink(element[0].querySelector('input[type="file"]'), ngModelCtrl);

  transclude((clone: JQuery) => {
    element.find('ng-transclude').replaceWith(clone);
  });
}

export default angular
    .module('editor.FileUploadModule', [])
    .directive('pcFileUpload', () => {
      return {
        controller: FileUploadCtrl,
        controllerAs: 'ctrl',
        link: link,
        require: ['pcFileUpload', 'ngModel'],
        restrict: 'E',
        scope: {
          'classes': '@',
          'extensions': '@',
        },
        templateUrl: 'src/editor/file-upload.ng',
        transclude: true,
      };
    });
