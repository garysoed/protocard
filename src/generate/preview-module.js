import PreviewCtrl from './preview-ctrl'

export default angular
    .module('pc.PreviewModule', [])
    .directive('pcPreview', () => {
      return {
        controller: PreviewCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          content: '=',
        },
        templateUrl: './generate/preview.ng',
        link: (scope, element, attr, ctrl) => {
          let inputEl = element[0].querySelector('iframe');
          ctrl.onLink(inputEl);
        }
      };
    });
