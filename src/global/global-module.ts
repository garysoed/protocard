import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service-module';
import AssetServiceModule from '../asset/asset-service-module';
import CodeEditorModule from '../editor/code-editor-module';
import GlobalCtrl from './global-ctrl';

export default angular
    .module('pc.global.GlobalModule', [
      AssetPipelineServiceModule.name,
      AssetServiceModule.name,
      CodeEditorModule.name
    ])
    .directive('pcGlobal', () => {
      return {
        controller: GlobalCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: './global/global.ng'
      };
    });
