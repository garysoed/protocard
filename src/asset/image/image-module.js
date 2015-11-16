import DriveDialogModule from '../../editor/drive-dialog-module';
import ImageCtrl from './image-ctrl';

export default angular
    .module('pc.asset.image.ImageModule', [
      DriveDialogModule.name
    ])
    .directive('pcAssetImage', () => {
      return {
        controller: ImageCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
        },
        templateUrl: './asset/image/image.ng'
      };
    });
