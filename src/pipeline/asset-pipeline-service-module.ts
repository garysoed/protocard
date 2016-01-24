import AssetPipelineService from './asset-pipeline-service';
import GeneratorServiceModule from '../generate/generator-service-module';
import RenderServiceModule from '../render/render-service-module';

export default angular
    .module('pc.pipeline.AssetPipelineModule', [
      GeneratorServiceModule.name,
      RenderServiceModule.name
    ])
    .service('AssetPipelineService', AssetPipelineService);
