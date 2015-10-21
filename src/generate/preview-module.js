export default angular
    .module('pc.PreviewModule', [])
    .directive('pcPreview', () => {
      return {
        restrict: 'E',
        scope: {
          content: '=',
        },
        templateUrl: './generate/preview.ng',
        link: (scope, element) => {
          let shadowRoot = element[0].createShadowRoot();
          shadowRoot.innerHTML = scope['content'];
        }
      };
    });
