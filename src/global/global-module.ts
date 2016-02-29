import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service-module';
import AssetServiceModule from '../asset/asset-service';
import CodeEditorModule from '../editor/code-editor-module';
import GlobalCtrl from './global-ctrl';

export default angular
    .module('global.GlobalModule', [
      AssetPipelineServiceModule.name,
      AssetServiceModule.name,
      CodeEditorModule.name,
    ])
    .directive('pcGlobal', () => {
      return {
        controller: GlobalCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: 'src/global/global.ng',
      };
    });
