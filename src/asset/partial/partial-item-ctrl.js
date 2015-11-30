/**
 * @class asset.partial.PartialItemCtrl
 */
export default class {
  /**
   * @constructor
   */
  constructor($scope, AssetService, NavigateService) {
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.name_ = $scope['name'];
    this.navigateService_ = NavigateService;
  }

  /**
   * Called when the delete button is clicked.
   *
   * @method onDeleteClick
   */
  onDeleteClick() {
    delete this.asset_.partials[this.name_];
    this.assetService_.saveAsset(this.asset_);
  }

  onEditClick() {
    this.navigateService_.toAsset(this.asset_.id, 'partial-editor', this.name_);
  }

  /**
   * @property name
   * @type {string}
   */
  get name() {
    return this.name_;
  }
  set name(newName) {
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
