import Asset from '../model/asset';
import AssetServiceModule, { AssetService } from '../asset/asset-service';
import ContextButtonModule from '../common/context-button';
import PartialItemModule from './partial-item';
import Utils from '../util/utils';


export class PartialCtrl {
  private asset_: Asset;
  private assetService_: AssetService;

  constructor(AssetService: AssetService) {
    this.assetService_ = AssetService;
  }

  /**
   * Called when the add button is clicked.
   */
  onAddClick(): void {
    let newName = Utils.generateKey(this.asset_.partials, 'partial');
    let newPartial = '<div>New partial</div>';
    this.asset_.partials[newName] = newPartial;
    this.assetService_.saveAsset(this.asset_);
  }

  get asset(): Asset {
    return this.asset_;
  }
  set asset(asset: Asset) {
    this.asset_ = asset;
  }

  get partials(): { [key: string]: string } {
    return this.asset_.partials;
  }
}

export default angular
    .module('partial.PartialModule', [
      AssetServiceModule.name,
      ContextButtonModule.name,
      PartialItemModule.name,
    ])
    .component('pcPartial', {
      bindings: {
        asset: '<',
      },
      controller: PartialCtrl,
      templateUrl: 'src/partial/partial.ng',
    });
