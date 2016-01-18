/**
 * @fileoverview Displays the navigation graph.
 */
import Asset from '../model/asset';
import AssetPipelineService from '../pipeline/asset-pipeline-service';
import GlobalNode from '../pipeline/global-node';
import HelperNode from '../pipeline/helper-node';
import ImageNode from '../pipeline/image-node';
import ProcessNode from '../pipeline/process-node';
import TextNode from '../pipeline/text-node';

export default class {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private deregisterFns_: Function[];
  private globalNode_: GlobalNode;
  private helperNode_: HelperNode;
  private imageNode_: ImageNode;
  private processNode_: ProcessNode;
  private textNode_: TextNode;

  constructor($scope: angular.IScope, AssetPipelineService: AssetPipelineService) {
    this.$scope_ = $scope;
    this.asset_ = $scope['asset'];

    let assetPipeline = AssetPipelineService.getPipeline(this.asset_.id);
    this.globalNode_ = assetPipeline.globalNode;
    this.helperNode_ = assetPipeline.helperNode;
    this.imageNode_ = assetPipeline.imageNode;
    this.processNode_ = assetPipeline.processNode;
    this.textNode_ = assetPipeline.textNode;

    this.deregisterFns_ = [
      this.globalNode_,
      this.helperNode_,
      this.imageNode_,
      this.processNode_,
      this.textNode_
    ].map(node => node.addChangeListener(this.onPipelineNodeChange_.bind(this)));

    $scope.$on('$destroy', this.onScopeDestroy_.bind(this));
  }

  private onScopeDestroy_() {
    this.deregisterFns_.forEach(fn => fn());
  }

  private onPipelineNodeChange_() {
    this.$scope_.$apply(() => {});
  }

  get canEditLabel(): boolean {
    return this.isProcessDataReady && this.globalNode_.isDone && this.helperNode_.isDone;
  }

  get canEditPartial(): boolean {
    return this.isLabelReady;
  }

  get canEditTemplate(): boolean {
    return this.canEditPartial;
  }

  get canProcessData(): boolean {
    return this.processNode_.isDependenciesDone;
  }

  get canPublish(): boolean {
    return this.isTemplateReady;
  }

  get canSetLabel(): boolean {
    return this.isProcessDataReady;
  }

  get isDataReady(): boolean {
    return this.textNode_.isDone;
  }

  get isLabelReady(): boolean {
    return this.canSetLabel && !!this.asset_.templateName;
  }

  get isPartialReady(): boolean {
    return this.canEditPartial;
  }

  get isProcessDataReady() {
    return this.processNode_.isDone;
  }

  get isTemplateReady(): boolean {
    return this.canEditTemplate && !!this.asset_.templateString;
  }
};
