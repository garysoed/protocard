import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service';
import ContextButtonModule from '../common/context-button';
import GeneratorServiceModule from '../generate/generator-service';
import RenderServiceModule from '../render/render-service';
import TemplateCtrl from './template-ctrl';

export default angular
    .module('template.TemplateModule', [
      AssetPipelineServiceModule.name,
      ContextButtonModule.name,
      GeneratorServiceModule.name,
      RenderServiceModule.name,
    ])
    .directive('pcTemplate', () => {
      return {
        controller: TemplateCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: 'src/template/template.ng',
      };
    });
