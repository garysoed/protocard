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
   * Navigates to the given asset's subview.
   *
   * @method toAsset
   * @param {string} assetId ID of asset to navigate to.
   * @param {string} [subview] Name of asset subview to navigate to. Defaults to empty string.
   */
  toAsset(assetId, subview = '') {
    this[__$location__].path(`/asset/${assetId}/${subview}`);
  }

  /**
   * Navigates to home.
   * @method toHome
   */
  toHome() {
    this[__$location__].path('/');
  }
};
