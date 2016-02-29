import AssetServiceModule from '../asset/asset-service';
import ContextButtonModule from '../common/context-button';
import PartialCtrl from './partial-ctrl';
import PartialItemModule from './partial-item-module';

export default angular
    .module('partial.PartialModule', [
      AssetServiceModule.name,
      ContextButtonModule.name,
      PartialItemModule.name,
    ])
    .directive('pcPartial', () => {
      return {
        controller: PartialCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          asset: '='
        },
        templateUrl: 'src/partial/partial.ng',
      };
    });
