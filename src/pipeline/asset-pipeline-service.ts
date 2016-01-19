/**
 * @fileoverview Maintains all the pipelines in the project.
 */
import AssetPipeline from './asset-pipeline';
import AssetService from '../asset/asset-service';
import GeneratorService from '../generate/generator-service';

export default class {
  private assetService_: AssetService;
  private generatorService_: GeneratorService;
  private pipelines_: { [assetId: string]: AssetPipeline};

  constructor(AssetService: AssetService, GeneratorService: GeneratorService) {
    this.assetService_ = AssetService;
    this.generatorService_ = GeneratorService;
    this.pipelines_ = {};
  }

  getPipeline(assetId: string) {
    if (!this.pipelines_[assetId]) {
      let asset = this.assetService_.getAsset(assetId);
      this.pipelines_[assetId] = new AssetPipeline(asset, this.generatorService_);
    }
    return this.pipelines_[assetId];
  }
};
