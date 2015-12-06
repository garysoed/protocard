import Extract from '../convert/extract';
import File from '../model/file';

/**
 * @class editor.FileUploadCtrl
 */
export default class {
  /**
   * @constructor
   */
  constructor($scope, $window) {
    this.inputEl_ = null;
    this.ngModelCtrl_ = null;
    this.file_ = null;
    this.classes_ = $scope['classes'];
    this.extensions_ = $scope['extensions'];
    this.$window_ = $window;
  }

  /**
   * Handler called when the is a change event on the input element.
   * @method onFileChange_
   * @private
   */
  onFileChange_() {
    let file = this.inputEl_.files[0];
    let fileReader = new this.$window_['FileReader']();
    fileReader.addEventListener('loadend', () => {
      let fileObj = new File(File.getType(file.name), fileReader.result);
      this.ngModelCtrl_.$setViewValue(fileObj);
    });
    fileReader.readAsText(file);
  }

  /**
   * @method classes
   * @return {string} Additional classes to be applied to the file upload button.
   */
  get classes() {
    return this.classes_;
  }

  /**
   * @method extensions
   * @return {string} File extensions to be applied to the file upload input.
   */
  get extensions() {
    return this.extensions_;
  }

  /**
   * Method called when linking the file upload.
   *
   * @method onLink
   * @param {Element} inputEl The input element for the file upload.
   * @param {ng.NgModelCtrl} ngModelCtrl Angular's ngModelCtrl.
   */
  onLink(inputEl, ngModelCtrl) {
    this.inputEl_ = inputEl;
    this.ngModelCtrl_ = ngModelCtrl;
    inputEl.addEventListener('change', this.onFileChange_.bind(this));
  }

  /**
   * Handler called when the upload button is clicked.
   *
   * @method onUploadClick
   */
  onUploadClick() {
    this.inputEl_.click();
  }
}
