import Asset from '../model/asset';
import AssetPipelineServiceModule, { AssetPipelineService }
    from '../pipeline/asset-pipeline-service';
import AssetServiceModule, { AssetService } from '../asset/asset-service';
import BaseComponent from '../../node_modules/gs-tools/src/ng/base-component';
import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import ContextButtonModule from '../common/context-button';
import File from '../model/file';
import FileUploadModule from '../editor/file-upload';
import { EventType as NodeEventType } from '../pipeline/node';
import Provider from '../util/provider';
import TextNode from '../pipeline/text-node';


export class TextCtrl extends BaseComponent {
  private asset_: Asset;
  private assetPipelineService_: AssetPipelineService;
  private assetService_: AssetService;
  private textNode_: TextNode;

  constructor(
      $scope: angular.IScope,
      AssetPipelineService: AssetPipelineService,
      AssetService: AssetService) {
    super($scope);
    this.assetPipelineService_ = AssetPipelineService;
    this.assetService_ = AssetService;
  }

  private onTextNodeChange_(): void {
    this.triggerDigest();
  }

  $onInit(): void {
    this.textNode_ = this.assetPipelineService_.getPipeline(this.asset_.id).textNode;
    this.addDisposable(this.textNode_.on(NodeEventType.CHANGED, this.onTextNodeChange_.bind(this)));
  }

  get asset(): Asset {
    return this.asset_;
  }
  set asset(asset: Asset) {
    this.asset_ = asset;
  }

  get data(): File {
    return this.asset_.data;
  }
  set data(newFile: File) {
    this.asset_.data = newFile;
    Cache.clear(this);
    this.assetService_.saveAsset(this.asset_);
    this.textNode_.refresh();
  }

  @Cache()
  get parsedData(): Provider<string[][]> {
    return new Provider<string[][]>(this.$scope, this.textNode_.result, []);
  }

  hasData(): boolean {
    return !!this.asset_.data;
  }
}


export default angular
    .module('text.TextModule', [
      AssetPipelineServiceModule.name,
      AssetServiceModule.name,
      ContextButtonModule.name,
      FileUploadModule.name,
    ])
    .component('pcText', {
      bindings: {
        'asset': '<',
      },
      controller: TextCtrl,
      templateUrl: 'src/text/text.ng',
    });
