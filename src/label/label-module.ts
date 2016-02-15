import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service-module';
import AssetServiceModule from '../asset/asset-service-module';
import ContextButtonModule from '../common/context-button-module';
import LabelCtrl from './label-ctrl';

export default angular
    .module('pc.label.LabelModule', [
      AssetPipelineServiceModule.name,
      AssetServiceModule.name,
      ContextButtonModule.name,
    ])
    .directive('pcLabel', () => {
      return {
        controller: LabelCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: './label/label.ng',
      };
    });
