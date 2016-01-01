import NavigateButtonCtrl from './navigate-button-ctrl';

export default angular
    .module('pc.common.NavigateButtonModule', [])
    .directive('pcNavigateButton', () => {
      return {
        controller: NavigateButtonCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'subview': '@',
          'selectedClass': '@',
          'text': '@',
        },
        templateUrl: './common/navigate-button.ng'
      };
    });
