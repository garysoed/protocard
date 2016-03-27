/**
 * @fileoverview Maintains all the pipelines in the project.
 */
import AssetPipeline from './asset-pipeline';
import { AssetService } from '../asset/asset-service';
import FuseServiceModule from '../thirdparty/fuse-service';
import GeneratorServiceModule, { GeneratorService } from '../generate/generator-service';
import RenderServiceModule, { RenderService } from '../render/render-service';

export class AssetPipelineService {
  private assetService_: AssetService;
  private fuseService_: FuseCtor;
  private generatorService_: GeneratorService;
  private pipelines_: { [assetId: string]: AssetPipeline};
  private renderService_: RenderService;

  constructor(
      AssetService: AssetService,
      FuseService: FuseCtor,
      GeneratorService: GeneratorService,
      RenderService: RenderService) {
    this.assetService_ = AssetService;
    this.fuseService_ = FuseService;
    this.generatorService_ = GeneratorService;
    this.pipelines_ = {};
    this.renderService_ = RenderService;
  }

  getPipeline(assetId: string): AssetPipeline {
    if (!this.pipelines_[assetId]) {
      let asset = this.assetService_.getAsset(assetId);
      this.pipelines_[assetId] = new AssetPipeline(
          asset,
          this.fuseService_,
          this.generatorService_,
          this.renderService_);
    }
    return this.pipelines_[assetId];
  }
};

export default angular
    .module('pipeline.AssetPipelineModule', [
      FuseServiceModule.name,
      GeneratorServiceModule.name,
      RenderServiceModule.name,
    ])
    .service('AssetPipelineService', AssetPipelineService);
