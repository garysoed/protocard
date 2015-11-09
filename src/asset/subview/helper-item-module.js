import HelperItemCtrl from './helper-item-ctrl';

export default angular
    .module('pc.asset.subview.HelperItemModule', [])
    .directive('pcAssetHelperItem', () => {
      return {
        controller: HelperItemCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          helper: '='
        },
        templateUrl: './asset/subview/helper-item.ng'
      };
    });
