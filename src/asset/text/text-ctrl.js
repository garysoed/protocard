import Extract from '../../convert/extract';
import { Types as FileTypes } from '../../model/file';

/**
 * @class asset.text.TextCtrl
 */
export default class {
  /**
   * @constructor
   */
  constructor($scope, AssetService) {
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.parsedData_ = null;
  }

  /**
   * @property data
   * @type {data.File}
   */
  get data() {
    return this.asset_.data;
  }
  set data(newFile) {
    this.asset_.data = newFile;
    this.assetService_.saveAsset(this.asset_);
    this.parsedData_ = null;
  }

  /**
   * @property parsedData
   * @type {Array}
   * @readonly
   */
  get parsedData() {
    if (this.parsedData_ === null) {
      // TODO(gs): Move to Extract.
      this.parsedData_ = this.asset_.data.content
          .split('\n')
          .map(line => line.split('\t'));
    }
    return this.parsedData_;
  }

  /**
   * @method hasData
   * @return {Boolean} True iff the controller has data to render.
   */
  hasData() {
    return !!this.asset_.data;
  }
}
