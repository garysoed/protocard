import NavigateButtonCtrl from './navigate-button-ctrl';

export default angular
    .module('pc.navigate.NavigateButtonModule', [])
    .directive('pcNavigateButton', () => {
      return {
        controller: NavigateButtonCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'disabled': '=',
          'icon': '@',
          'subview': '@',
          'text': '@',
        },
        templateUrl: 'src/navigate/navigate-button.ng',
      };
    });
