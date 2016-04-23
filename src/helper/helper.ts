import Asset from '../model/asset';
import AssetPipelineServiceModule, { AssetPipelineService }
    from '../pipeline/asset-pipeline-service';
import AssetServiceModule, { AssetService } from '../asset/asset-service';
import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import FunctionObject from '../model/function-object';
import HelperItemModule from './helper-item';
import HelperNode from '../pipeline/helper-node';
import { NavigateService } from '../navigate/navigate-service';
import Provider from '../util/provider';
import Utils from '../util/utils';

/**
 * Controller for the helper subview.
 */
export class HelperCtrl {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private assetPipelineService_: AssetPipelineService;
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
    this.assetPipelineService_ = AssetPipelineService;
    this.assetService_ = AssetService;
    this.navigateService_ = NavigateService;
  }

  $onInit(): void {
    this.helperNode_ = this.assetPipelineService_.getPipeline(this.asset.id).helperNode;
  }

  get asset(): Asset {
    return this.asset_;
  }
  set asset(asset: Asset) {
    this.asset_ = asset;
  }

  @Cache()
  get helpers(): Provider<{ [key: string]: FunctionObject }> {
    return new Provider(
        this.$scope_,
        this.helperNode_.result,
        <{ [key: string]: FunctionObject }> {});
  }

  /**
   * Handler called when the add button is clicked.
   */
  onAddClick(): void {
    let newName = Utils.generateKey(this.asset_.helpers, 'helper');
    let newHelper = new FunctionObject('return function() { }');
    this.asset_.helpers[newName] = newHelper;
    Cache.clear(this);
    this.helperNode_.refresh();
    this.assetService_.saveAsset(this.asset_);
  }

  onChange(oldName: string, newName: string): void {
    let helper = this.asset_.helpers[oldName];
    delete this.asset_.helpers[oldName];
    this.asset_.helpers[newName] = helper;
    Cache.clear(this);
    this.helperNode_.refresh();
    this.assetService_.saveAsset(this.asset_);
  }

  onDelete(helperName: string): void {
    delete this.asset_.helpers[helperName];
    Cache.clear(this);
    this.helperNode_.refresh();
    this.assetService_.saveAsset(this.asset_);
  }

  onEdit(helperName: string): void {
    this.navigateService_.toAsset(this.asset_.id, 'helper.editor', helperName);
  }
}


export default angular
    .module('helper.HelperModule', [
      AssetPipelineServiceModule.name,
      AssetServiceModule.name,
      HelperItemModule.name,
    ])
    .component('pcHelper', {
      bindings: {
        'asset': '<',
      },
      controller: HelperCtrl,
      templateUrl: 'src/helper/helper.ng',
    });
