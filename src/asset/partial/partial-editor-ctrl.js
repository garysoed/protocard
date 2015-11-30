/**
 * @class asset.partial.PartialEditorCtrl
 */
export default class {
  /**
   * @constructor
   */
  constructor($scope, AssetService, GeneratorService) {
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.localDataList_ = GeneratorService.localDataList($scope['asset']);
    this.name_ = $scope['name'];
    this.previewData_ = null;
    this.templateString_ = this.asset_.partials[this.name_];
  }

  get asset() {
    return this.asset_;
  }

  get templateString() {
    return this.templateString_;
  }
  set templateString(newString) {
    this.templateString_ = newString;
    if (newString !== null) {
      this.asset_.partials[this.name_] = newString;
      this.assetService_.saveAsset(this.asset_);
    }
  }

  get previewData() {
    if (this.previewData_ === null && this.localDataList_.length > 0) {
      this.previewData_ =
          this.localDataList_[Math.floor(Math.random() * this.localDataList_.length)];
    }
    return this.previewData_;
  }

  /**
   * Called when the refresh button is clicked.
   *
   * @method onRefreshClick
   */
  onRefreshClick() {
    this.previewData_ = null;
  }
}
