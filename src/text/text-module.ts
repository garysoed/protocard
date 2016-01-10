import AssetServiceModule from '../asset/asset-service-module';
import ContextButtonModule from '../common/context-button-module';
import FileUploadModule from '../editor/file-upload-module';
import TextCtrl from './text-ctrl';

export default angular
    .module('pc.text.TextModule', [
      AssetServiceModule.name,
      ContextButtonModule.name,
      FileUploadModule.name
    ])
    .directive('pcText', () => {
      return {
        controller: TextCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: './text/text.ng'
      };
    });
