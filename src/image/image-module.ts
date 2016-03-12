import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service-module';
import AssetServiceModule from '../asset/asset-service';
import DriveDialogModule from '../editor/drive-dialog';
import ImageCtrl from './image-ctrl';
import ImageSelectModule from '../editor/image-select';

export default angular
    .module('image.ImageModule', [
      AssetPipelineServiceModule.name,
      AssetServiceModule.name,
      DriveDialogModule.name,
      ImageSelectModule.name,
    ])
    .directive('pcImage', () => {
      return {
        controller: ImageCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: 'src/image/image.ng',
      };
    });
