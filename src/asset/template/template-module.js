import AssetServiceModule from '../../data/asset-service-module';
import CodeEditorModule from '../../editor/code-editor-module';
import GeneratorServiceModule from '../../generate/generator-service-module';
import RenderServiceModule from '../render/render-service-module';
import TemplateCtrl from './template-ctrl';

function link(scope, element, attr, ctrl) {
  ctrl.onLink(element[0].querySelector('iframe'));
}

export default angular
    .module('pc.asset.template.TemplateModule', [
      CodeEditorModule.name,
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
        templateUrl: './asset/template/template.ng',
        link: link
      };
    });
