import PartialItemCtrl from './partial-item-ctrl';

export default angular
    .module('partial.PartialItemModule', [])
    .directive('pcPartialItem', () => {
      return {
        controller: PartialItemCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          asset: '=',
          name: '=',
        },
        templateUrl: 'src/partial/partial-item.ng',
      };
    });
