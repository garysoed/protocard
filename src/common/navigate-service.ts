export default class NavigateService {
  private $location_: angular.ILocationService;

  constructor($location: angular.ILocationService) {
    this.$location_ = $location;
  }

  /**
   * Navigates to the given asset's subview.
   *
   * @param assetId ID of asset to navigate to.
   * @param [subview] Name of asset subview to navigate to. Defaults to empty string.
   * @param [subitemId] Name of the sub item associated with the asset.
   */
  toAsset(assetId: string, subview = '', subitemId: string = null) {
    let path = `/asset/${assetId}/${subview}`;
    if (subitemId !== null) {
      path += `/${subitemId}`;
    }
    this.$location_.path(path);
  }

  /**
   * Navigates to home.
   */
  toHome() {
    this.$location_.path('/');
  }
};
