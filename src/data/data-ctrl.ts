import Asset from '../model/asset';
import AssetPipelineService from '../pipeline/asset-pipeline-service';
import AssetService from '../asset/asset-service';
import Cache from '../decorator/cache';
import ProcessNode from '../pipeline/process-node';
import Provider from '../util/provider';

export default class DataCtrl {
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

  onRefreshClick() {
    Cache.clear(this);
  }

  @Cache
  get preview(): Provider<string> {
    return new Provider<string>(
        this.$scope_,
        this.processNode_.result
            .then(rows => {
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
