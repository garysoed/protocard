export class NavigateService {
  private $location_: angular.ILocationService;

  constructor($location: angular.ILocationService) {
    this.$location_ = $location;
  }

  getSubview(): string {
    return this.$location_.search()['subview'] || null;
  }

  /**
   * Navigates to the given asset's subview.
   *
   * @param assetId ID of asset to navigate to.
   * @param [subview] Name of asset subview to navigate to. Defaults to empty string.
   * @param [subitemId] Name of the sub item associated with the asset.
   */
  toAsset(assetId: string, subview: string = null, subitemId: string = null): void {
    let path = `/asset/${assetId}`;

    if (subview !== null) {
      this.toSubview(subview);
    }
    if (subitemId !== null) {
      this.$location_.search('subitem', subitemId);
    }
    this.$location_.path(path);
  }

  /**
   * Navigates to home.
   */
  toHome(): void {
    this.$location_.url('/');
  }

  toSubview(subview: string): void {
    this.$location_.search('subview', subview);
  }
};

export default angular
    .module('common.NavigateServiceModule', ['ng'])
    .service('NavigateService', NavigateService);
