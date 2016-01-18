import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service-module';
import CodeEditorModule from '../editor/code-editor-module';
import ContextButtonModule from '../common/context-button-module';
import DataCtrl from './data-ctrl';

export default angular
    .module('pc.asset.data.DataModule', [
      AssetPipelineServiceModule.name,
      CodeEditorModule.name,
      ContextButtonModule.name
    ])
    .directive('pcData', () => {
      return {
        controller: DataCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: './data/data.ng'
      };
    });
