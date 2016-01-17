import Asset from '../model/asset';
import AssetPipelineService from '../pipeline/asset-pipeline-service';
import AssetService from '../asset/asset-service';
import Cache from '../decorators/cache';
import Extract from '../convert/extract';
import File from '../model/file';
import { FileTypes } from '../model/file';
import Provider from '../common/provider';
import TextNode from '../pipeline/text-node';

export default class TextCtrl {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private assetService_: AssetService;
  private textNode_: TextNode;

  constructor(
      $scope: angular.IScope,
      AssetPipelineService: AssetPipelineService,
      AssetService: AssetService) {
    this.$scope_ = $scope;
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.textNode_ = AssetPipelineService.getPipeline($scope['asset'].id).textNode;
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

  @Cache
  get parsedData(): Provider<string[][]> {
    return new Provider<string[][]>(
        this.$scope_,
        this.textNode_.result,
        []);
  }

  hasData(): boolean {
    return !!this.asset_.data;
  }
}
