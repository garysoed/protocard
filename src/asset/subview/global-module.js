import GlobalCtrl from './global-ctrl';

export default angular
    .module('pc.asset.subview.GlobalModule', [])
    .directive('pcAssetGlobal', () => {
      return {
        controller: GlobalCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
        },
        templateUrl: './asset/subview/global.ng'
      };
    });
