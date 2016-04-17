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


export class DataCtrl {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private assetService_: AssetService;
  private processNode_: ProcessNode;
  private processorString_: string;

  constructor(
      $scope: angular.IScope,
      AssetPipelineService: AssetPipelineService,
      AssetService: AssetService) {
    this.$scope_ = $scope;
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.processorString_ = this.asset_.dataProcessor.fnString;
    this.processNode_ = AssetPipelineService.getPipeline($scope['asset'].id).processNode;
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
    .directive('pcData', () => {
      return {
        controller: DataCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '=',
        },
        templateUrl: 'src/data/data.ng',
      };
    });
