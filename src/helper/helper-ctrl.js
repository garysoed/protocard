import FunctionObject from '../model/function-object';
import { Events as HelperItemEvents } from './helper-item-ctrl';
import Utils from '../utils';

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
  constructor($scope, AssetService, NavigateService) {
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.navigateService_ = NavigateService;

    $scope.$on(HelperItemEvents.CHANGED, this.onHelperItemChanged_.bind(this));
    $scope.$on(HelperItemEvents.DELETED, this.onHelperItemDeleted_.bind(this));
    $scope.$on(HelperItemEvents.EDITED, this.onHelperItemEdited_.bind(this));
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
   * @param {ng.Event} event
   * @param {string} oldName Previous name of the helper.
   * @param {string} newName New name of the helper.
   * @private
   */
  onHelperItemChanged_(event, oldName, newName) {
    let helper = this.asset_.helpers[oldName];
    delete this.asset_.helpers[oldName];
    this.asset_.helpers[newName] = helper;
    this.assetService_.saveAsset(this.asset_);
  }

  /**
   * Handler called when a helper item fires a deleted event.
   *
   * @method onHelperItemDeleted_
   * @param {ng.Event} event
   * @param {string} helperName Name of the helper that was deleted.
   * @private
   */
  onHelperItemDeleted_(event, helperName) {
    delete this.asset_.helpers[helperName];
    this.assetService_.saveAsset(this.asset_);
  }

  /**
   * Handler called when a helper item fires an edited event.
   *
   * @method onHelperItemEdited_
   * @param {ng.Event} event
   * @param {string} helperName Name of the helper that was edited.
   * @private
   */
  onHelperItemEdited_(event, helperName) {
    this.navigateService_.toAsset(this.asset_.id, 'helper-editor', helperName);
  }

  /**
   * Handler called when the add button is clicked.
   *
   * @method onAddClick
   */
  onAddClick() {
    let newName = Utils.generateKey(this.asset_.helpers, 'helper');
    let newHelper = new FunctionObject('return function() { }');
    this.asset_.helpers[newName] = newHelper;
    this.assetService_.saveAsset(this.asset_);
  }
}
