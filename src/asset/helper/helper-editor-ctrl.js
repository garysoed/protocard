/**
 * @class asset.subview.HelperEditorCtrl
 */
export default class {
  /**
   * @constructor
   * @param {!ng.$scope} $scope
   * @param {!data.AssetService} AssetService
   */
  constructor($scope, AssetService) {
    this.assetService_ = AssetService;
    this.asset_ = $scope['asset'];
    this.helper_ = $scope['helper'];
    this.helperString_ = this.helper_.fnString;
  }

  /**
   * @property helperString
   * @type {string}
   */
  get helperString() {
    return this.helperString_;
  }

  set helperString(newValue) {
    this.helperString_ = newValue;
    if (newValue !== null) {
      this.helper_.fnString = newValue;
      this.assetService_.saveAsset(this.asset_);
    }
  }
}
