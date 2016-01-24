/**
 * @fileoverview Maintains all the pipelines in the project.
 */
import AssetPipeline from './asset-pipeline';
import AssetService from '../asset/asset-service';
import GeneratorService from '../generate/generator-service';
import RenderService from '../render/render-service';

export default class {
  private assetService_: AssetService;
  private generatorService_: GeneratorService;
  private pipelines_: { [assetId: string]: AssetPipeline};
  private renderService_: RenderService;

  constructor(
      AssetService: AssetService,
      GeneratorService: GeneratorService,
      RenderService: RenderService) {
    this.assetService_ = AssetService;
    this.generatorService_ = GeneratorService;
    this.pipelines_ = {};
    this.renderService_ = RenderService;
  }

  getPipeline(assetId: string) {
    if (!this.pipelines_[assetId]) {
      let asset = this.assetService_.getAsset(assetId);
      this.pipelines_[assetId] = new AssetPipeline(
          asset,
          this.generatorService_,
          this.renderService_);
    }
    return this.pipelines_[assetId];
  }
};
