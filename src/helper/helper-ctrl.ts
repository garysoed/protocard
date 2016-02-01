import Asset from '../model/asset';
import AssetPipelineService from '../pipeline/asset-pipeline-service';
import AssetService from '../asset/asset-service';
import Cache from '../decorator/cache';
import FunctionObject from '../model/function-object';
import { Events as HelperItemEvents } from './helper-item-ctrl';
import HelperNode from '../pipeline/helper-node';
import NavigateService from '../navigate/navigate-service';
import Provider from '../util/provider';
import Utils from '../util/utils';

/**
 * Controller for the helper subview.
 */
export default class {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private assetService_: AssetService;
  private helperNode_: HelperNode;
  private navigateService_: NavigateService;

  /**
   * @param {ng.$scope} $scope
   * @param {data.AssetService} AssetService
   */
  constructor(
      $scope: angular.IScope,
      AssetPipelineService: AssetPipelineService,
      AssetService: AssetService,
      NavigateService: NavigateService) {
    this.$scope_ = $scope;
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.helperNode_ = AssetPipelineService.getPipeline(this.asset_.id).helperNode;
    this.navigateService_ = NavigateService;

    $scope.$on(HelperItemEvents.CHANGED, this.onHelperItemChanged_.bind(this));
    $scope.$on(HelperItemEvents.DELETED, this.onHelperItemDeleted_.bind(this));
    $scope.$on(HelperItemEvents.EDITED, this.onHelperItemEdited_.bind(this));
  }

  @Cache
  get helpers(): Provider<{ [key: string]: FunctionObject }> {
    return new Provider(
        this.$scope_,
        this.helperNode_.result,
        <{ [key: string]: FunctionObject }>{});
  }

  /**
   * Handler called when a helper item fires a changed event.
   *
   * @param event
   * @param oldName Previous name of the helper.
   * @param newName New name of the helper.
   */
  private onHelperItemChanged_(event: any, oldName: string, newName: string) {
    let helper = this.asset_.helpers[oldName];
    delete this.asset_.helpers[oldName];
    this.asset_.helpers[newName] = helper;
    Cache.clear(this);
    this.helperNode_.refresh();
    this.assetService_.saveAsset(this.asset_);
  }

  /**
   * Handler called when a helper item fires a deleted event.
   *
   * @param event
   * @param helperName Name of the helper that was deleted.
   */
  private onHelperItemDeleted_(event: any, helperName: string) {
    delete this.asset_.helpers[helperName];
    Cache.clear(this);
    this.helperNode_.refresh();
    this.assetService_.saveAsset(this.asset_);
  }

  /**
   * Handler called when a helper item fires an edited event.
   *
   * @param event
   * @param helperName Name of the helper that was edited.
   */
  onHelperItemEdited_(event: any, helperName: string) {
    this.navigateService_.toAsset(this.asset_.id, 'helper.editor', helperName);
  }

  /**
   * Handler called when the add button is clicked.
   */
  onAddClick() {
    let newName = Utils.generateKey(this.asset_.helpers, 'helper');
    let newHelper = new FunctionObject('return function() { }');
    this.asset_.helpers[newName] = newHelper;
    Cache.clear(this);
    this.helperNode_.refresh();
    this.assetService_.saveAsset(this.asset_);
  }
}
