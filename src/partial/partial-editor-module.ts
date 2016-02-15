import AssetNamePickerModule from '../common/asset-name-picker-module';
import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service-module';
import ContextButtonModule from '../common/context-button-module';
import PartialEditorCtrl from './partial-editor-ctrl';

export default angular
    .module('pc.partial.PartialEditorModule', [
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
        templateUrl: './partial/partial-editor.ng',
      };
    });
