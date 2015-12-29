/**
 * @class template.TemplateCtrl
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
    this.localDataList_ = GeneratorService.generateNames($scope['asset']);
    this.previewName_ = null;
    this.previewData_ = null;
    this.templateString_ = this.asset_.templateString;
    this.query_ = '';
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
    let names = Object.keys(this.localDataList_);
    if (this.previewName_ === null && names.length > 0) {
      this.previewName_ = names[Math.floor(Math.random() * names.length)];
    }

    return this.previewName_ !== null ? this.localDataList_[this.previewName_] : null;
  }

  get query() {
    return this.previewName_;
  }
  set query(newQuery) {
    this.previewName_ = newQuery;
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
    this.previewName_ = null;
  }
}
