import PartialItemCtrl from './partial-item-ctrl';

export default angular
    .module('pc.partial.PartialItemModule', [])
    .directive('pcPartialItem', () => {
      return {
        controller: PartialItemCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          asset: '=',
          name: '='
        },
        templateUrl: './partial/partial-item.ng'
      };
    });
