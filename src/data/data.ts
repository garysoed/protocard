import Asset from '../model/asset';
import AssetPipelineServiceModule, { AssetPipelineService }
    from '../pipeline/asset-pipeline-service';
import { AssetService } from '../asset/asset-service';
import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import CodeEditorModule from '../editor/code-editor';
import ContextButtonModule from '../common/context-button';
import PreviewableCodeEditorModule from '../editor/previewable-code-editor';
import ProcessNode from '../pipeline/process-node';
import Provider from '../util/provider';
import Records from '../../node_modules/gs-tools/src/collection/records';


export class DataCtrl {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private assetPipelineService_: AssetPipelineService;
  private assetService_: AssetService;
  private processNode_: ProcessNode;
  private processorString_: string;

  constructor(
      $scope: angular.IScope,
      AssetPipelineService: AssetPipelineService,
      AssetService: AssetService) {
    this.$scope_ = $scope;
    this.assetPipelineService_ = AssetPipelineService;
    this.assetService_ = AssetService;
  }

  $onChanges(changes: { [key: string]: any }): void {
    Records.of(changes).forEach((value: any, key: string) => {
      if (key === 'asset') {
        this.asset = value.currentValue;
        this.processorString_ = this.asset.dataProcessor.fnString;
        this.processNode_ = this.assetPipelineService_.getPipeline(this.asset.id).processNode;
      }
    });
  }

  $onInit(): void {
    this.processorString_ = this.asset.dataProcessor.fnString;
    this.processNode_ = this.assetPipelineService_.getPipeline(this.asset.id).processNode;
  }

  get asset(): Asset {
    return this.asset_;
  }
  set asset(asset: Asset) {
    this.asset_ = asset;
  }

  onRefreshClick(): void {
    Cache.clear(this);
  }

  @Cache()
  get preview(): Provider<string> {
    return new Provider<string>(
        this.$scope_,
        this.processNode_.result
            .then((rows: any[]) => {
              let obj = rows[Math.floor(Math.random() * rows.length)];
              return JSON.stringify(obj, null, 2).trim();
            }),
        '');
  }

  get processorString(): string {
    return this.processorString_;
  }
  set processorString(newValue: string) {
    this.processorString_ = newValue;
    if (newValue !== null) {
      this.asset_.dataProcessor.fnString = newValue;
      Cache.clear(this);
      this.assetService_.saveAsset(this.asset_);
      this.processNode_.refresh();
    }
  }
}

export default angular
    .module('asset.data.DataModule', [
      AssetPipelineServiceModule.name,
      CodeEditorModule.name,
      ContextButtonModule.name,
      PreviewableCodeEditorModule.name,
    ])
    .component('pcData', {
      bindings: {
        'asset': '<',
      },
      controller: DataCtrl,
      templateUrl: 'src/data/data.ng',
    });
