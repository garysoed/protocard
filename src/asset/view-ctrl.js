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
    this.$routeParams_ = $routeParams;
    this.assetService_ = AssetService;
    this.navigateService_ = NavigateService;
    this.asset_ = null;
    this.subview_ = null;
    this.currentHelper_ = null;
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
    return this.asset_ && this.asset_.name;
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
   * Current helper associated with the view, if any.
   *
   * @property currentHelper
   * @type {data.Helper}
   * @readonly
   */
  get currentHelper() {
    return this.currentHelper_;
  }

  /**
   * Name of the current subview, if any.
   *
   * @property subview
   * @type {string}
   */
  get subview() {
    return this.subview_;
  }
  set subview(subview) {
    this.subview_ = subview;
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
    this.asset_ = this.assetService_.getAsset(this.$routeParams_['assetId']);
    if (!this.asset_) {
      this.navigateService_.toHome();
    } else {
      this.subview_ = this.$routeParams_['section'];
      this.currentHelper_ = this.subview_ === 'helper-editor'
          ? this.asset_.helpers[this.$routeParams_['helper']]
          : null;
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
