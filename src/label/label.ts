/**
 * @fileoverview Subview to set the asset label.
 */
import Asset from '../model/asset';
import AssetPipelineServiceModule, { AssetPipelineService }
    from '../pipeline/asset-pipeline-service';
import AssetServiceModule, { AssetService } from '../asset/asset-service';
import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import ContextButtonModule from '../common/context-button';
import LabelNode from '../pipeline/label-node';
import Provider from '../util/provider';

export class LabelCtrl {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private assetPipelineService_: AssetPipelineService;
  private assetService_: AssetService;
  private labelNode_: LabelNode;

  constructor(
      $scope: angular.IScope,
      AssetPipelineService: AssetPipelineService,
      AssetService: AssetService) {
    this.$scope_ = $scope;
    this.assetService_ = AssetService;
    this.assetPipelineService_ = AssetPipelineService;
  }

  $onInit(): void {
    this.labelNode_ = this.assetPipelineService_.getPipeline(this.asset_.id).labelNode;
  }

  get asset(): Asset {
    return this.asset_;
  }
  set asset(asset: Asset) {
    this.asset_ = asset;
  }

  get assetLabel(): string {
    return this.asset_.templateName;
  }
  set assetLabel(label: string) {
    this.asset_.templateName = label;
    Cache.clear(this);
    this.assetService_.saveAsset(this.asset_);
    this.labelNode_.refresh();
  }

  @Cache()
  get preview(): Provider<string> {
    return new Provider(
        this.$scope_,
        this.labelNode_.result
            .then((labels: { data: { [key: string]: any } }) => {
              let keys = Object.keys(labels.data);
              return keys.length > 0 ? keys[Math.floor(Math.random() * keys.length)] : '';
            }),
        '');
  }

  onRefreshClick(): void {
    Cache.clear(this);
  }
};

export default angular
    .module('label.LabelModule', [
      AssetPipelineServiceModule.name,
      AssetServiceModule.name,
      ContextButtonModule.name,
    ])
    .component('pcLabel', {
      bindings: {
        'asset': '<',
      },
      controller: LabelCtrl,
      templateUrl: 'src/label/label.ng',
    });
