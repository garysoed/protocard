import AssetNamePickerModule from '../common/asset-name-picker';
import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service-module';
import ContextButtonModule from '../common/context-button';
import PartialEditorCtrl from './partial-editor-ctrl';

export default angular
    .module('partial.PartialEditorModule', [
      AssetNamePickerModule.name,
      AssetPipelineServiceModule.name,
      ContextButtonModule.name,
    ])
    .directive('pcPartialEditor', () => {
      return {
        controller: PartialEditorCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '=',
          'name': '=',
        },
        templateUrl: 'src/partial/partial-editor.ng',
      };
    });
