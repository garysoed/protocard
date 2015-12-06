import PartialEditorCtrl from './partial-editor-ctrl';

export default angular
    .module('pc.partial.PartialEditorModule', [])
    .directive('pcPartialEditor', () => {
      return {
        controller: PartialEditorCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '=',
          'name': '='
        },
        templateUrl: './partial/partial-editor.ng'
      };
    });
