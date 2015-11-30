/**
 * @class common.NavigateService
 */
export default class {
  /**
   * @constructor
   * @param {ng.$location} $location
   */
  constructor($location) {
    this.$location_ = $location;
  }

  /**
   * Navigates to the given asset's subview.
   *
   * @method toAsset
   * @param {string} assetId ID of asset to navigate to.
   * @param {string} [subview] Name of asset subview to navigate to. Defaults to empty string.
   * @param {string} [subitemId] Name of the sub item associated with the asset.
   */
  toAsset(assetId, subview = '', subitemId = null) {
    let path = `/asset/${assetId}/${subview}`;
    if (subitemId !== null) {
      path += `/${subitemId}`;
    }
    this.$location_.path(path);
  }

  /**
   * Navigates to home.
   * @method toHome
   */
  toHome() {
    this.$location_.path('/');
  }
};
