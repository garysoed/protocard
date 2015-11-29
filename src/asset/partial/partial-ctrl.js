import Utils from '../../utils';

/**
 * @class asset.partial.PartialCtrl
 */
export default class {
  /**
   * @constructor
   * @param {ng.Scope} $scope
   * @param {data.AssetService} AssetService
   */
  constructor($scope, AssetService) {
    // TODO(gs): Check types from the $scope at runtime.
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
  }

  /**
   * Called when the add button is clicked.
   *
   * @method onAddClick
   */
  onAddClick() {
    let newName = Utils.generateKey(this.asset_.partials, 'partial');
    let newPartial = '<div>New partial</div>';
    this.asset_.partials[newName] = newPartial;
    this.assetService_.saveAsset(this.asset_);
  }

  /**
   * @property asset
   * @type {data.Asset}
   * @readonly
   */
  get asset() {
    return this.asset_;
  }

  /**
   * @property
   * @type {Object}
   * @readonly
   */
  get partials() {
    return this.asset_.partials;
  }
}
