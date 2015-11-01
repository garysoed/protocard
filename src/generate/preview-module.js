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
          let parser = new DOMParser();
          // inputEl.srcdoc = parser.parse(scope['content'], )
          inputEl.addEventListener('load', () => {
            // TODO(gs): Build flag to the origin.
            inputEl.contentWindow.postMessage({
              'type': 'render',
              'data': scope['content']
            }, 'http://localhost:8080');
          });
        }
      };
    });
