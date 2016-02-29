import AssetPipelineService from './asset-pipeline-service';
import FuseServiceModule from '../thirdparty/fuse-service-module';
import GeneratorServiceModule from '../generate/generator-service-module';
import RenderServiceModule from '../render/render-service-module';

export default angular
    .module('pipeline.AssetPipelineModule', [
      FuseServiceModule.name,
      GeneratorServiceModule.name,
      RenderServiceModule.name,
    ])
    .service('AssetPipelineService', AssetPipelineService);
