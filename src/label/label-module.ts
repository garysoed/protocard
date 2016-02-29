import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service-module';
import AssetServiceModule from '../asset/asset-service';
import ContextButtonModule from '../common/context-button';
import LabelCtrl from './label-ctrl';

export default angular
    .module('label.LabelModule', [
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
        templateUrl: 'src/label/label.ng',
      };
    });
