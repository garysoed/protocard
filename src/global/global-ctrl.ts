import Asset from '../model/asset';
import AssetPipelineService from '../pipeline/asset-pipeline-service';
import AssetService from '../asset/asset-service';
import GlobalNode from '../pipeline/global-node';

/**
 * @class asset.subview.GlobalCtrl
 */
export default class {
  private asset_: Asset;
  private assetService_: AssetService;
  private globalNode_: GlobalNode;
  private globalsString_: string;

  constructor(
      $scope: angular.IScope,
      AssetPipelineService: AssetPipelineService,
      AssetService: AssetService) {
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.globalNode_ = AssetPipelineService.getPipeline(this.asset_.id).globalNode;
    this.globalsString_ = this.asset_.globalsString;
  }

  /**
   * @return True iff the globals string is non null.
   */
  isValid(): boolean {
    return this.globalsString !== null;
  }

  /**
   * String representation of the globals value.
   */
  get globalsString(): string {
    return this.globalsString_;
  }
  set globalsString(newValue: string) {
    this.globalsString_ = newValue;
    if (newValue !== null) {
      this.asset_.globalsString = newValue;
      this.assetService_.saveAsset(this.asset_);
      this.globalNode_.refresh();
    }
  }
}
