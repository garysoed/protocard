import ErrorDisplayCtrl from './error-display-ctrl';

export default angular
    .module('pc.common.ErrorDisplayModule', [])
    .directive('pcErrorDisplay', () => {
      return {
        controller: ErrorDisplayCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'error': '='
        },
        templateUrl: './common/error-display.ng',
      };
    });
