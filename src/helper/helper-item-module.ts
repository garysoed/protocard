import HelperItemCtrl from './helper-item-ctrl';

export default angular
    .module('helper.HelperItemModule', [])
    .directive('pcHelperItem', () => {
      return {
        controller: HelperItemCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          name: '='
        },
        templateUrl: 'src/helper/helper-item.ng',
      };
    });
