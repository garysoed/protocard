import AssetServiceModule from '../asset/asset-service-module';
import ContextButtonModule from '../common/context-button-module';
import PartialCtrl from './partial-ctrl';
import PartialItemModule from './partial-item-module';

export default angular
    .module('pc.partial.PartialModule', [
      AssetServiceModule.name,
      ContextButtonModule.name,
      PartialItemModule.name
    ])
    .directive('pcPartial', () => {
      return {
        controller: PartialCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          asset: '='
        },
        templateUrl: './partial/partial.ng'
      };
    });
