import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service';
import AssetServiceModule from '../asset/asset-service';
import ContextButtonModule from '../common/context-button';
import FileUploadModule from '../editor/file-upload';
import TextCtrl from './text-ctrl';

export default angular
    .module('text.TextModule', [
      AssetPipelineServiceModule.name,
      AssetServiceModule.name,
      ContextButtonModule.name,
      FileUploadModule.name,
    ])
    .directive('pcText', () => {
      return {
        controller: TextCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: 'src/text/text.ng',
      };
    });
