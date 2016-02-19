import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service-module';
import NavGraphCtrl from './nav-graph-ctrl';
import NavigateButtonModule from '../navigate/navigate-button-module';

export default angular
    .module('pc.asset.NavGraphModule', [
      AssetPipelineServiceModule.name,
      NavigateButtonModule.name,
    ])
    .directive('pcNavGraph', () => {
      return {
        controller: NavGraphCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: 'src/asset/nav-graph.ng',
      };
    });
