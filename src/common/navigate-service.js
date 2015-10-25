const __$location__ = Symbol('$location');

/**
 * @class common.NavigateService
 */
export default class {
  /**
   * @constructor
   * @param {ng.$location} $location
   */
  constructor($location) {
    this[__$location__] = $location;
  }

  /**
   * Navigates to asset home.
   * @method toAssetHome
   * @param {string} assetId ID of asset to navigate to.
   */
  toAssetHome(assetId) {
    this[__$location__].path(`/asset/${assetId}`);
  }

  /**
   * Navigates to home.
   * @method toHome
   */
  toHome() {
    this[__$location__].path('/');
  }
};
