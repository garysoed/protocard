import AssetServiceModule from '../../data/asset-service-module';
import DriveDialogModule from '../../editor/drive-dialog-module';
import ImageCtrl from './image-ctrl';
import ImageSelectModule from '../../editor/image-select-module';

export default angular
    .module('pc.asset.image.ImageModule', [
      AssetServiceModule.name,
      DriveDialogModule.name,
      ImageSelectModule.name
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
