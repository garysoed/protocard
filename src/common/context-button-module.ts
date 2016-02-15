import ContextButtonCtrl from './context-button-ctrl';

function link(
    scope: angular.IScope,
    element: JQuery,
    attrs: any,
    ctrl: any,
    transclude: angular.ITranscludeFunction): void {
  transclude((clone: JQuery) => {
    element.find('ng-transclude').replaceWith(clone);
  });
}

export default angular
    .module('pc.common.ContextButtonModule', [])
    .directive('pcContextButton', () => {

      return {
        controller: ContextButtonCtrl,
        controllerAs: 'ctrl',
        link: link,
        restrict: 'E',
        scope: {
        },
        templateUrl: './common/context-button.ng',
        transclude: true,
      };
    });
