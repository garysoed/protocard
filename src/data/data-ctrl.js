/**
 * @class asset.data.DataCtrl
 */
export default class {
  /**
   * @constructor
   */
  constructor($scope, AssetService) {
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.processorString_ = this.asset_.dataProcessor.fnString;
  }

  /**
   * @property processorString
   * @type {string}
   */
  get processorString() {
    return this.processorString_;
  }
  set processorString(newValue) {
    this.processorString_ = newValue;
    if (newValue !== null) {
      this.asset_.dataProcessor.fnString = newValue;
      this.assetService_.saveAsset(this.asset_);
    }
  }
}
