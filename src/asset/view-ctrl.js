const __asset__ = Symbol('asset');
const __navigateService__ = Symbol('navigateService');

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
  constructor($routeParams, AssetService, NavigateService) {
    this[__asset__] = AssetService.getAsset($routeParams.assetId);
    this[__navigateService__] = NavigateService;
    if (!this[__asset__]) {
      NavigateService.toHome();
    }
  }

  /**
   * @method getAsset
   * @return {data.Asset} The asset in context.
   */
  getAsset() {
    return this[__asset__];
  }

  /**
   * @method getAssetName
   * @return {string} The name of the asset in context.
   */
  getAssetName() {
    return this[__asset__].name;
  }

  /**
   * Handler called when the back button is clicked.
   * @method onBackClick
   */
  onBackClick() {
    this[__navigateService__].toHome();
  }
};
