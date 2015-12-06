import AssetServiceModule from '../../asset/asset-service-module';
import FileUploadModule from '../../editor/file-upload-module';
import TextCtrl from './text-ctrl';

export default angular
    .module('pc.asset.text.TextModule', [
      AssetServiceModule.name,
      FileUploadModule.name
    ])
    .directive('pcAssetText', () => {
      return {
        controller: TextCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: './asset/text/text.ng'
      };
    });
