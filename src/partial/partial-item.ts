import Asset from '../model/asset';
import { AssetService } from '../asset/asset-service';
import { NavigateService } from '../navigate/navigate-service';

export class PartialItemCtrl {
  private asset_: Asset;
  private assetService_: AssetService;
  private name_: string;
  private navigateService_: NavigateService;

  constructor(
      AssetService: AssetService,
      NavigateService: NavigateService) {
    this.assetService_ = AssetService;
    this.navigateService_ = NavigateService;
  }

  get asset(): Asset {
    return this.asset_;
  }
  set asset(asset: Asset) {
    this.asset_ = asset;
  }

  get initName(): string {
    return this.name_;
  }
  set initName(initName: string) {
    this.name_ = initName;
  }

  get name(): string {
    return this.name_;
  }
  set name(newName: string) {
    if (this.asset_.partials[newName] === undefined) {
      let oldTemplate = this.asset_.partials[this.name_];
      delete this.asset_.partials[this.name_];
      this.asset_.partials[newName] = oldTemplate;
      this.name_ = newName;
      this.assetService_.saveAsset(this.asset_);
    } else {
      // TODO(gs): Error message.
    }
  }

  /**
   * Called when the delete button is clicked.
   */
  onDeleteClick(): void {
    delete this.asset_.partials[this.name_];
    this.assetService_.saveAsset(this.asset_);
  }

  onEditClick(): void {
    this.navigateService_.toAsset(this.asset_.id, 'partial.editor', this.name_);
  }
}

export default angular
    .module('partial.PartialItemModule', [])
    .component('pcPartialItem', {
      bindings: {
        asset: '<',
        initName: '<',
      },
      controller: PartialItemCtrl,
      templateUrl: 'src/partial/partial-item.ng',
    });
