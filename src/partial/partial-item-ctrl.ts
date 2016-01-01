import Asset from '../model/asset';
import AssetService from '../asset/asset-service';
import NavigateService from '../common/navigate-service';

export default class {
  private asset_: Asset;
  private assetService_: AssetService;
  private name_: string;
  private navigateService_: NavigateService;

  constructor(
      $scope: angular.IScope,
      AssetService: AssetService,
      NavigateService: NavigateService) {
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.name_ = $scope['name'];
    this.navigateService_ = NavigateService;
  }

  /**
   * Called when the delete button is clicked.
   */
  onDeleteClick() {
    delete this.asset_.partials[this.name_];
    this.assetService_.saveAsset(this.asset_);
  }

  onEditClick() {
    this.navigateService_.toAsset(this.asset_.id, 'partial.editor', this.name_);
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
}
