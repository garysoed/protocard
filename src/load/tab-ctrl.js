import DataFormat from '../data/data-format';
import RawSource from '../data/raw-source';

const __$scope__ = Symbol('$scope');
const __asset__ = Symbol('asset');
const __assetService__ = Symbol('assetService');
const __document__ = Symbol('document');
const __fileReaderCtor__ = Symbol('fileReaderCtor');
const __getUploadFiles__ = Symbol('getUploadFiles');

/**
 * Controller for the load tab.
 *
 * @class load.TabCtrl
 */
export default class {

  /**
   * @constructor
   * @method constructor
   * @param {ng.$document} $document
   * @param {ng.$scope} $scope
   * @param {Window} $window
   * @param {data.AssetService} AssetService
   */
  constructor($document, $scope, $window, AssetService) {
    this[__$scope__] = $scope;
    this[__asset__] = $scope.asset;
    this[__assetService__] = AssetService;
    this[__document__] = $document[0];
    this[__fileReaderCtor__] = $window.FileReader;
  }

  /**
   * @method __getUploadFiles__
   * @return {Array} Array of `File` objects that have been added to the file uploader.
   * @private
   */
  [__getUploadFiles__]() {
    return this[__document__].querySelector('.load-tab input[type="file"]').files;
  }

  /**
   * @method getDataPreview
   * @return {string} Preview text of the asset source data.
   */
  getDataPreview() {
    return this.hasDataPreview() ? this[__asset__].source.rawData : '';
  }

  /**
   * @method getSupportedFormat
   * @return {Array} Array of supported format.
   */
  getSupportedFormat() {
    return DataFormat;
  }

  /**
   * @method hasDataPreview
   * @return {Boolean} True iff the asset exists and it has a data source.
   */
  hasDataPreview() {
    return !!this[__asset__].source
        && !!this[__asset__].source.rawData;
  }

  /**
   * @method isValid
   * @return {Boolean} [description]
   */
  isValid() {
    return !!(this[__$scope__].uploadForm && this[__$scope__].uploadForm.$valid)
        && this[__getUploadFiles__]().length > 0;
  }

  /**
   * Handler called when the load button is clicked.
   *
   * @method onLoadClick
   */
  onLoadClick() {
    let fileReader = new this[__fileReaderCtor__]();
    fileReader.addEventListener('loadend', () => {
      this[__asset__].source = new RawSource(fileReader.result, this[__$scope__].dataFormat);
      this[__assetService__].saveAsset(this[__asset__]);
      this[__$scope__].$apply(() => {});
      // TODO(gs): Reset the form.
      // TODO(gs): Trigger digest when file is added.
    });
    fileReader.readAsText(this[__getUploadFiles__]()[0]);
  }
};
