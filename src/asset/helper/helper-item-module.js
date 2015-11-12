import HelperItemCtrl from './helper-item-ctrl';

export default angular
    .module('pc.asset.subview.HelperItemModule', [])
    .directive('pcAssetHelperItem', () => {
      return {
        controller: HelperItemCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          helper: '=',
          name: '='
        },
        templateUrl: './asset/helper/helper-item.ng'
      };
    });
