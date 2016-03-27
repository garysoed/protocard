import Asset from '../model/asset';
import { AssetPipelineService } from '../pipeline/asset-pipeline-service';
import { AssetService } from '../asset/asset-service';
import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import File from '../model/file';
import Provider from '../util/provider';
import TextNode from '../pipeline/text-node';

export default class TextCtrl {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private assetService_: AssetService;
  private changeListenerDeregister_: Function;
  private textNode_: TextNode;

  constructor(
      $scope: angular.IScope,
      AssetPipelineService: AssetPipelineService,
      AssetService: AssetService) {
    this.$scope_ = $scope;
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.textNode_ = AssetPipelineService.getPipeline($scope['asset'].id).textNode;
    this.changeListenerDeregister_ =
        this.textNode_.addChangeListener(this.onTextNodeChange_.bind(this));

    $scope.$on('$destroy', this.onDestroy_.bind(this));
  }

  private onDestroy_(): void {
    this.changeListenerDeregister_();
  }

  private onTextNodeChange_(): void {
    this.$scope_.$apply(() => undefined);
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
    return new Provider<string[][]>(
        this.$scope_,
        this.textNode_.result,
        []);
  }

  hasData(): boolean {
    return !!this.asset_.data;
  }
}
