import AssetServiceModule from '../../data/asset-service-module';
import DriveDialogModule from '../../editor/drive-dialog-module';
import ImageCtrl from './image-ctrl';

export default angular
    .module('pc.asset.image.ImageModule', [
      AssetServiceModule.name,
      DriveDialogModule.name
    ])
    .directive('pcAssetImage', () => {
      return {
        controller: ImageCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: './asset/image/image.ng'
      };
    });
