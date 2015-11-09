import Helper from '../../data/helper';
import { Events as HelperItemEvents } from './helper-item-ctrl';
import Utils from '../../utils';

/**
 * Controller for the helper subview.
 *
 * @class asset.subview.HelperCtrl
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

    $scope.$on(HelperItemEvents.CHANGED, this.onHelperItemChanged_.bind(this));
  }

  /**
   * @property helpers
   * @type {Object}
   * @readonly
   */
  get helpers() {
    return this.asset_.helpers;
  }

  /**
   * Handler called when a helper item fires a changed event.
   *
   * @method onHelperItemChanged_
   */
  onHelperItemChanged_() {
    this.assetService_.saveAsset(this.asset_);
  }

  /**
   * Handler called when the add button is clicked.
   *
   * @method onAddClick
   */
  onAddClick() {
    let newHelper = new Helper(Utils.generateKey(this.asset_.helpers, 'helper'));
    this.asset_.helpers[newHelper.name] = newHelper;
    this.assetService_.saveAsset(this.asset_);
  }
}
