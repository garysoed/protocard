/**
 * @class asset.subview.HelperEditorCtrl
 */
export default class {
  /**
   * @constructor
   * @param {!ng.$scope} $scope
   * @param {!data.AssetService} AssetService
   */
  constructor($scope, AssetService) {
    this.assetService_ = AssetService;
    this.asset_ = $scope['asset'];
    this.helper_ = $scope['helper'];
  }

  /**
   * @property helperString
   * @type {string}
   */
  get helperString() {
    return this.helper_.fnString;
  }

  set helperString(newValue) {
    this.helper_.fnString = newValue;
  }

  /**
   * @method isValid
   * @return {Boolean} True iff the helper editor has a valid value.
   */
  isValid() {
    return this.helperString !== null;
  }

  /**
   * Helper called when the save button is clicked.
   *
   * @method onSaveClick
   */
  onSaveClick() {
    this.assetService_.saveAsset(this.asset_);
  }
}
