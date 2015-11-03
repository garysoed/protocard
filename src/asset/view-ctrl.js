/**
 * Controller for the create page view.
 *
 * @class asset.ViewCtrl
 */
export default class {

  /**
   * @constructor
   * @param {ng.$routeParams} $routeParams
   * @param {data.AssetService} AssetService
   * @param {common.NavigateService} NavigateService
   */
  constructor($scope, $routeParams, AssetService, NavigateService) {
    this.$scope_ = $scope;
    this.asset_ = AssetService.getAsset($routeParams['assetId']);
    this.navigateService_ = NavigateService;
    this.subview_ = $routeParams['section'] || null;
  }

  /**
   * The asset viewed.
   *
   * @property asset
   * @type {data.Asset}
   * @readonly
   */
  get asset() {
    return this.asset_;
  }

  /**
   * Name of the asset viewed.
   *
   * @property assetName
   * @type {string}
   * @readonly
   */
  get assetName() {
    return this.asset_.name;
  }

  /**
   * Name of the current subview.
   *
   * @property subview
   * @type {string}
   * @readonly
   */
  get subview() {
    return this.subview_;
  }

  /**
   * Handler called when the back button is clicked.
   *
   * @method onBackClick
   */
  onBackClick() {
    this.navigateService_.toHome();
  }

  /**
   * Handler called when the controller is initialized
   *
   * @method onInit
   */
  onInit() {
    this.$scope_['subview'] = this.subview_;
    if (!this.asset_) {
      this.navigateService_.toHome();
    }
  }

  /**
   * Handler called when the navigation button is clicked.
   *
   * @method onNavigateClick
   * @param {string} value Name of subview to navigate to.
   */
  onNavigateClick(value) {
    this.subview_ = value;
    this.navigateService_.toAsset(this.asset_.id, value);
  }
};
