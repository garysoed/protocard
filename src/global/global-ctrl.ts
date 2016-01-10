import Asset from '../model/asset';
import AssetService from '../asset/asset-service';

/**
 * @class asset.subview.GlobalCtrl
 */
export default class {
  private $mdToast_: angular.material.IToastService;
  private asset_: Asset;
  private assetService_: AssetService;
  private globalsString_: string;

  constructor(
      $mdToast: angular.material.IToastService,
      $scope: angular.IScope,
      AssetService: AssetService) {
    this.$mdToast_ = $mdToast;
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.globalsString_ = this.asset_.globalsString;
  }

  /**
   * @return True iff the globals string is non null.
   */
  isValid(): boolean {
    return this.globalsString !== null;
  }

  /**
   * String representation of the globals value.
   */
  get globalsString(): string {
    return this.globalsString_;
  }
  set globalsString(newValue: string) {
    this.globalsString_ = newValue;
    if (newValue !== null) {
      this.asset_.globalsString = newValue;
      this.assetService_.saveAsset(this.asset_);
      let now = new Date();
      this.$mdToast_.show(
          this.$mdToast_.simple()
              .textContent(`Asset ${this.asset_.name} saved at ${now.toLocaleTimeString()}`)
              .position('bottom left'));
    }
  }
}
