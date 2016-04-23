import BaseComponent from '../../node_modules/gs-tools/src/ng/base-component';
import File from '../model/file';
import ListenableElement, { EventType as DomEventType }
    from '../../node_modules/gs-tools/src/event/listenable-element';


export class FileUploadCtrl extends BaseComponent {
  private $element_: angular.IAugmentedJQuery;
  private $window_: Window;
  private classes_: string;
  private extensions_: string;
  private inputEl_: ListenableElement<HTMLInputElement>;
  private ngModel_: angular.INgModelController;

  constructor(
      $element: angular.IAugmentedJQuery,
      $scope: angular.IScope,
      $window: Window) {
    super($scope);
    this.$element_ = $element;
    this.$window_ = $window;
  }

  /**
   * Handler called when the is a change event on the input element.
   */
  private onFileChange_(): void {
    let file = this.inputEl_.element.files[0];
    let fileReader = new this.$window_['FileReader']();
    fileReader.addEventListener('loadend', () => {
      let fileObj = new File(File.getType(file.name), fileReader.result);
      this.ngModel_.$setViewValue(fileObj);
    });
    fileReader.readAsText(file);
  }

  $onInit(): void {
    this.inputEl_ = ListenableElement.of(
        <HTMLInputElement> this.$element_[0].querySelector('input[type="file"]'));
    this.inputEl_.on(DomEventType.CHANGE, this.onFileChange_.bind(this));
    this.addDisposable(this.inputEl_);
  }

  /**
   * @return Additional classes to be applied to the file upload button.
   */
   get classes(): string {
     return this.classes_;
   }
   set classes(classes: string) {
     this.classes_ = classes;
   }

  /**
   * @return File extensions to be applied to the file upload input.
   */
  get extensions(): string {
    return this.extensions_;
  }
  set extensions(extensions: string) {
    this.extensions_ = extensions;
  }

  get ngModel(): angular.INgModelController {
    return this.ngModel_;
  }
  set ngModel(ngModel: angular.INgModelController) {
    this.ngModel_ = ngModel;
  }

  /**
   * Handler called when the upload button is clicked.
   */
  onUploadClick(): void {
    this.inputEl_.element.click();
  }
}

export default angular
    .module('editor.FileUploadModule', [])
    .component('pcFileUpload', {
      bindings: {
        'classes': '@',
        'extensions': '@',
      },
      controller: FileUploadCtrl,
      require: {
        'ngModel': 'ngModel',
      },
      templateUrl: 'src/editor/file-upload.ng',
      transclude: true,
    });
