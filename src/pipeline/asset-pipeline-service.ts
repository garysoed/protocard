/**
 * @fileoverview Maintains all the pipelines in the project.
 */
import AssetPipeline from './asset-pipeline';
import AssetService from '../asset/asset-service';

export default class {
  private assetService_: AssetService;
  private pipelines_: { [assetId: string]: AssetPipeline};

  constructor(AssetService) {
    this.assetService_ = AssetService;
    this.pipelines_ = {};
  }

  getPipeline(assetId: string) {
    if (!this.pipelines_[assetId]) {
      let asset = this.assetService_.getAsset(assetId);
      this.pipelines_[assetId] = new AssetPipeline(asset);
    }
    return this.pipelines_[assetId];
  }
};
