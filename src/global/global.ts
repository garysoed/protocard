import Asset from '../model/asset';
import AssetPipelineServiceModule, { AssetPipelineService }
    from '../pipeline/asset-pipeline-service';
import AssetServiceModule, { AssetService } from '../asset/asset-service';
import CodeEditorModule from '../editor/code-editor';
import GlobalNode from '../pipeline/global-node';


/**
 * @class global.GlobalCtrl
 */
export class GlobalCtrl {
  private asset_: Asset;
  private assetPipelineService_: AssetPipelineService;
  private assetService_: AssetService;
  private globalNode_: GlobalNode;
  private globalsString_: string;

  constructor(
      AssetPipelineService: AssetPipelineService,
      AssetService: AssetService) {
    this.assetPipelineService_ = AssetPipelineService;
    this.assetService_ = AssetService;
  }

  $onInit(): void {
    this.globalNode_ = this.assetPipelineService_.getPipeline(this.asset.id).globalNode;
    this.globalsString_ = this.asset.globalsString;
  }

  get asset(): Asset {
    return this.asset_;
  }
  set asset(asset: Asset) {
    this.asset_ = asset;
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

export default angular
    .module('global.GlobalModule', [
      AssetPipelineServiceModule.name,
      AssetServiceModule.name,
      CodeEditorModule.name,
    ])
    .component('pcGlobal', {
      bindings: {
        'asset': '<',
      },
      controller: GlobalCtrl,
      templateUrl: 'src/global/global.ng',
    });
