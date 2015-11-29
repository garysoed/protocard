/**
 * @class asset.partial.PartialItemCtrl
 */
export default class {
  /**
   * @constructor
   */
  constructor($scope, AssetService) {
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.name_ = $scope['name'];
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
    debugger;
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
      this.assetService_.saveAsset(this.asset_);
    } else {
      // TODO(gs): Error message.
    }
  }
}
