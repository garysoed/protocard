import AssetServiceModule from '../../data/asset-service-module';
import CodeEditorModule from '../../editor/code-editor-module';
import TemplateCtrl from './template-ctrl';

export default angular
    .module('pc.asset.template.TemplateModule', [
      CodeEditorModule.name
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
