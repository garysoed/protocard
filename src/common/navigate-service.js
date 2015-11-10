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
   * @param {string} [helperName] Name of the helper associated with the asset.
   */
  toAsset(assetId, subview = '', helperName = null) {
    let path = `/asset/${assetId}/${subview}`;
    if (helperName !== null) {
      path += `/${helperName}`;
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
