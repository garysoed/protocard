/**
 * @class asset.template.TemplateCtrl
 */
export default class {
  /**
   * @constructor
   * @param {ng.Scope} $scope
   * @param {data.AssetService} AssetService
   * @param {generate.GeneratorService} GeneratorService
   */
  constructor($scope, AssetService, GeneratorService) {
    // TODO(gs): Show errors when rendering.
    this.$scope_ = $scope;
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.localDataList_ = GeneratorService.localDataList($scope['asset']);
    this.previewData_ = null;
    this.templateString_ = this.asset_.templateString;
  }

  /**
   * @property asset
   * @type {data.Asset}
   * @readonly
   */
  get asset() {
    return this.asset_;
  }

  /**
   * @property
   * @type {Object}
   * @readonly
   */
  get previewData() {
    if (this.previewData_ === null && this.localDataList_.length > 0) {
      this.previewData_ =
          this.localDataList_[Math.floor(Math.random() * this.localDataList_.length)];
    }
    return this.previewData_;
  }


  /**
   * @property templateString
   * @type {string}
   */
  get templateString() {
    return this.templateString_;
  }
  set templateString(templateString) {
    this.templateString_ = templateString;
    if (templateString !== null) {
      this.asset_.templateString = templateString;
      this.assetService_.saveAsset(this.asset_);
    }
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
