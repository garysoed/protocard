import TabCtrl from './tab-ctrl';

export default angular
    .module('load.TabModule', [])
    .directive('pcLoadTab', () => {
      return {
        controller: TabCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          asset: '=',
        },
        templateUrl: './load/tab.ng'
      };
    });
