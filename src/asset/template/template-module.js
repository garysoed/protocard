import AssetServiceModule from '../../data/asset-service-module';
import TemplateEditorModule from '../../editor/template-editor-module';
import GeneratorServiceModule from '../../generate/generator-service-module';
import RenderServiceModule from '../../render/render-service-module';
import TemplateCtrl from './template-ctrl';

export default angular
    .module('pc.asset.template.TemplateModule', [
      TemplateEditorModule.name,
      GeneratorServiceModule.name,
      RenderServiceModule.name
    ])
    .directive('pcAssetTemplate', () => {
      return {
        controller: TemplateCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: './asset/template/template.ng'
      };
    });
