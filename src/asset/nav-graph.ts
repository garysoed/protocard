/**
 * @fileoverview Displays the navigation graph.
 */
import Asset from '../model/asset';
import AssetPipeline from '../pipeline/asset-pipeline';
import AssetPipelineService from '../pipeline/asset-pipeline-service';
import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service-module';
import BaseDisposable from '../../node_modules/gs-tools/src/dispose/base-disposable';
import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import ExportNode from '../pipeline/export-node';
import GlobalNode from '../pipeline/global-node';
import HelperNode from '../pipeline/helper-node';
import ImageNode from '../pipeline/image-node';
import LabelNode from '../pipeline/label-node';
import NavigateButtonModule from '../navigate/navigate-button-module';
import PartialNode from '../pipeline/partial-node';
import ProcessNode from '../pipeline/process-node';
import TemplateNode from '../pipeline/template-node';
import TextNode from '../pipeline/text-node';


export class NavGraphCtrl extends BaseDisposable {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private assetPipelineService_: AssetPipelineService;
  private deregisterFns_: Function[];

  constructor($scope: angular.IScope, AssetPipelineService: AssetPipelineService) {
    super();
    this.$scope_ = $scope;
    this.assetPipelineService_ = AssetPipelineService;
    this.deregisterFns_ = [];

    $scope.$on('$destroy', this.onScopeDestroy_.bind(this));
  }

  @Cache()
  private get assetPipeline_(): AssetPipeline {
    return this.assetPipelineService_.getPipeline(this.asset_.id);
  }

  @Cache()
  private get exportNode_(): ExportNode {
    let node = this.assetPipeline_.exportNode;
    this.deregisterFns_.push(node.addChangeListener(this.onPipelineNodeChange_.bind(this)));
    return node;
  }

  @Cache()
  private get globalNode_(): GlobalNode {
    let node = this.assetPipeline_.globalNode;
    this.deregisterFns_.push(node.addChangeListener(this.onPipelineNodeChange_.bind(this)));
    return node;
  }

  @Cache()
  private get helperNode_(): HelperNode {
    let node = this.assetPipeline_.helperNode;
    this.deregisterFns_.push(node.addChangeListener(this.onPipelineNodeChange_.bind(this)));
    return node;
  }

  @Cache()
  private get imageNode_(): ImageNode {
    let node = this.assetPipeline_.imageNode;
    this.deregisterFns_.push(node.addChangeListener(this.onPipelineNodeChange_.bind(this)));
    return node;
  }

  @Cache()
  private get labelNode_(): LabelNode {
    let node = this.assetPipeline_.labelNode;
    this.deregisterFns_.push(node.addChangeListener(this.onPipelineNodeChange_.bind(this)));
    return node;
  }

  private onScopeDestroy_(): void {
    this.deregisterFns_.forEach((fn: Function) => fn());
  }

  private onPipelineNodeChange_(): void {
    this.$scope_.$apply(() => undefined);
  }

  @Cache()
  private get partialNode_(): PartialNode {
    let node = this.assetPipeline_.partialNode;
    this.deregisterFns_.push(node.addChangeListener(this.onPipelineNodeChange_.bind(this)));
    return node;
  }

  @Cache()
  private get processNode_(): ProcessNode {
    let node = this.assetPipeline_.processNode;
    this.deregisterFns_.push(node.addChangeListener(this.onPipelineNodeChange_.bind(this)));
    return node;
  }

  @Cache()
  private get templateNode_(): TemplateNode {
    let node = this.assetPipeline_.templateNode;
    this.deregisterFns_.push(node.addChangeListener(this.onPipelineNodeChange_.bind(this)));
    return node;
  }

  @Cache()
  private get textNode_(): TextNode {
    let node = this.assetPipeline_.textNode;
    this.deregisterFns_.push(node.addChangeListener(this.onPipelineNodeChange_.bind(this)));
    return node;
  }

  get asset(): Asset {
    return this.asset_;
  }
  set asset(asset: Asset) {
    this.asset_ = asset;
  }

  get canEditLabel(): boolean {
    return this.labelNode_.isDependenciesDone;
  }

  get canEditPartial(): boolean {
    return this.partialNode_.isDependenciesDone;
  }

  get canEditTemplate(): boolean {
    return this.templateNode_.isDependenciesDone;
  }

  get canProcessData(): boolean {
    return this.processNode_.isDependenciesDone;
  }

  get canPublish(): boolean {
    return this.exportNode_.isDependenciesDone;
  }

  get isDataReady(): boolean {
    return this.textNode_.isDone;
  }

  get isLabelReady(): boolean {
    return this.labelNode_.isDone;
  }

  get isPartialReady(): boolean {
    return this.partialNode_.isDone;
  }

  get isProcessDataReady(): boolean {
    return this.processNode_.isDone;
  }

  get isTemplateReady(): boolean {
    return this.templateNode_.isDone;
  }
};

export default angular
    .module('asset.NavGraphModule', [
      AssetPipelineServiceModule.name,
      NavigateButtonModule.name,
    ])
    .component('pcNavGraph', {
      bindings: {
        'asset': '<'
      },
      controller: NavGraphCtrl,
      templateUrl: 'src/asset/nav-graph.ng',
    });
