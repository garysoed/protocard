import AssetServiceModule from '../../data/asset-service-module';
import PartialCtrl from './partial-ctrl';
import PartialItemModule from './partial-item-module';

export default angular
    .module('pc.asset.partial.PartialModule', [
      AssetServiceModule.name,
      PartialItemModule.name
    ])
    .directive('pcAssetPartial', () => {
      return {
        controller: PartialCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          asset: '='
        },
        templateUrl: './asset/partial/partial.ng'
      };
    });
