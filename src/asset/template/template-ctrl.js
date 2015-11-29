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
    this.$scope_ = $scope;
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.generatorService_ = GeneratorService;
    this.iframeEl_ = null;
    this.localDataList_ = GeneratorService.localDataList($scope['asset']);
    this.previewData_ = null;
    this.templateString_ = this.asset_.templateString;
  }

  /**
   * Updates the preview URL.
   *
   * @method updatePreview_
   * @return {Promise} The Promise that will be resolved when the preview URL is updated.
   * @private
   */
  updatePreview_() {
    if (this.previewData_ === null && this.localDataList_.length > 0) {
      this.previewData_ =
          this.localDataList_[Math.floor(Math.random() * this.localDataList_.length)];
    }

    let data = this.generatorService_.generate(this.asset_, [this.previewData_]);
    for (let key in data) {
      this.iframeEl_.srcdoc = data[key];
    }
    // TODO(gs): Expose error message.
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
      this.updatePreview_();
    }
  }

  /**
   * Called during linking.
   * @method onLink
   * @param {Element} iframeEl
   */
  onLink(iframeEl) {
    this.iframeEl_ = iframeEl;
    this.updatePreview_();
  }

  /**
   * Called when the refresh button is clicked.
   *
   * @method onRefreshClick
   */
  onRefreshClick() {
    this.previewData_ = null;
    this.updatePreview_();
  }
}
