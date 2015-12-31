import Asset from '../model/asset';
import AssetService from '../asset/asset-service';
import Utils from '../utils';

export default class {
  private asset_: Asset;
  private assetService_: AssetService;

  constructor($scope: angular.IScope, AssetService: AssetService) {
    // TODO(gs): Check types from the $scope at runtime.
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
  }

  /**
   * Called when the add button is clicked.
   */
  onAddClick() {
    let newName = Utils.generateKey(this.asset_.partials, 'partial');
    let newPartial = '<div>New partial</div>';
    this.asset_.partials[newName] = newPartial;
    this.assetService_.saveAsset(this.asset_);
  }

  get asset(): Asset {
    return this.asset_;
  }

  get partials(): { [key: string]: string } {
    return this.asset_.partials;
  }
}
