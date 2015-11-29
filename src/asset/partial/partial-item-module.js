import PartialItemCtrl from './partial-item-ctrl';

export default angular
    .module('pc.asset.partial.PartialItemModule', [])
    .directive('pcAssetPartialItem', () => {
      return {
        controller: PartialItemCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          asset: '=',
          name: '='
        },
        templateUrl: './asset/partial/partial-item.ng'
      };
    });
