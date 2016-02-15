/**
 * @fileoverview Displays the navigation graph.
 */
import Asset from '../model/asset';
import AssetPipelineService from '../pipeline/asset-pipeline-service';
import ExportNode from '../pipeline/export-node';
import GlobalNode from '../pipeline/global-node';
import HelperNode from '../pipeline/helper-node';
import ImageNode from '../pipeline/image-node';
import LabelNode from '../pipeline/label-node';
import Node from '../pipeline/node';
import PartialNode from '../pipeline/partial-node';
import ProcessNode from '../pipeline/process-node';
import TemplateNode from '../pipeline/template-node';
import TextNode from '../pipeline/text-node';

export default class {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private deregisterFns_: Function[];
  private exportNode_: ExportNode;
  private globalNode_: GlobalNode;
  private helperNode_: HelperNode;
  private imageNode_: ImageNode;
  private labelNode_: LabelNode;
  private partialNode_: PartialNode;
  private processNode_: ProcessNode;
  private templateNode_: TemplateNode;
  private textNode_: TextNode;

  constructor($scope: angular.IScope, AssetPipelineService: AssetPipelineService) {
    this.$scope_ = $scope;
    this.asset_ = $scope['asset'];

    let assetPipeline = AssetPipelineService.getPipeline(this.asset_.id);
    this.exportNode_ = assetPipeline.exportNode;
    this.globalNode_ = assetPipeline.globalNode;
    this.helperNode_ = assetPipeline.helperNode;
    this.imageNode_ = assetPipeline.imageNode;
    this.labelNode_ = assetPipeline.labelNode;
    this.partialNode_ = assetPipeline.partialNode;
    this.processNode_ = assetPipeline.processNode;
    this.templateNode_ = assetPipeline.templateNode;
    this.textNode_ = assetPipeline.textNode;

    this.deregisterFns_ = [
      this.exportNode_,
      this.globalNode_,
      this.helperNode_,
      this.imageNode_,
      this.labelNode_,
      this.partialNode_,
      this.processNode_,
      this.templateNode_,
      this.textNode_,
    ].map((node: Node<any>) => node.addChangeListener(this.onPipelineNodeChange_.bind(this)));

    $scope.$on('$destroy', this.onScopeDestroy_.bind(this));
  }

  private onScopeDestroy_(): void {
    this.deregisterFns_.forEach((fn: Function) => fn());
  }

  private onPipelineNodeChange_(): void {
    this.$scope_.$apply(() => undefined);
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
