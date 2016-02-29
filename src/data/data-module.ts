import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service-module';
import CodeEditorModule from '../editor/code-editor-module';
import ContextButtonModule from '../common/context-button';
import DataCtrl from './data-ctrl';
import PreviewableCodeEditorModule from '../editor/previewable-code-editor-module';

export default angular
    .module('asset.data.DataModule', [
      AssetPipelineServiceModule.name,
      CodeEditorModule.name,
      ContextButtonModule.name,
      PreviewableCodeEditorModule.name,
    ])
    .directive('pcData', () => {
      return {
        controller: DataCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: 'src/data/data.ng',
      };
    });
