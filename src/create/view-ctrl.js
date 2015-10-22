const __asset__ = Symbol('asset');
const __$location__ = Symbol('$location');

/**
 * Controller for the create page view.
 *
 * @class create.ViewCtrl
 */
export default class {

  /**
   * @constructor
   * @param {ng.$location} $location
   * @param {ng.$routeParams} $routeParams
   * @param {data.AssetService} AssetService
   */
  constructor($location, $routeParams, AssetService) {
    this[__asset__] = AssetService.getAsset($routeParams.assetId);
    if (!this[__asset__]) {
      $location.path('/');
    }

    this[__$location__] = $location;
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

  getSelectedTab() {
    return 0;
  }

  /**
   * Handler called when the back button is clicked.
   * @method onBackClick
   */
  onBackClick() {
    this[__$location__].path('/');
  }
};
