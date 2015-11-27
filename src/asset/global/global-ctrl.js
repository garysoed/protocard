import { Events as CodeEditorEvents } from '../../editor/code-editor-ctrl';

/**
 * @class asset.subview.GlobalCtrl
 */
export default class {
  /**
   * @constructor
   * @param {ng.$scope} $scope
   * @param {data.AssetService} AssetService
   */
  constructor($scope, AssetService) {
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.globalsString_ = this.asset_.globalsString;
  }

  /**
   * @method isValid
   * @return {Boolean} True iff the globals string is non null.
   */
  isValid() {
    return this.globalsString !== null;
  }

  /**
   * String representation of the globals value.
   * @property globalsString
   * @type {string}
   */
  get globalsString() {
    return this.globalsString_;
  }
  set globalsString(newValue) {
    this.globalsString_ = newValue;
    if (newValue !== null) {
      this.asset_.globalsString = newValue;
      this.assetService_.saveAsset(this.asset_);
    }
  }
}
