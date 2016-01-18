import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service-module';
import AssetServiceModule from '../asset/asset-service-module';
import HelperCtrl from './helper-ctrl';
import HelperItemModule from './helper-item-module';

export default angular
    .module('pc.helper.HelperModule', [
      AssetPipelineServiceModule.name,
      AssetServiceModule.name,
      HelperItemModule.name
    ])
    .directive('pcHelper', () => {
      return {
        controller: HelperCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: './helper/helper.ng'
      };
    });
