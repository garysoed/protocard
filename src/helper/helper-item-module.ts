import HelperItemCtrl from './helper-item-ctrl';

export default angular
    .module('pc.helper.HelperItemModule', [])
    .directive('pcHelperItem', () => {
      return {
        controller: HelperItemCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          name: '='
        },
        templateUrl: './helper/helper-item.ng'
      };
    });
