import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service-module';
import AssetServiceModule from '../asset/asset-service-module';
import DriveDialogModule from '../editor/drive-dialog-module';
import ImageCtrl from './image-ctrl';
import ImageSelectModule from '../editor/image-select-module';

export default angular
    .module('pc.image.ImageModule', [
      AssetPipelineServiceModule.name,
      AssetServiceModule.name,
      DriveDialogModule.name,
      ImageSelectModule.name
    ])
    .directive('pcImage', () => {
      return {
        controller: ImageCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: './image/image.ng'
      };
    });
