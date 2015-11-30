import PartialEditorCtrl from './partial-editor-ctrl';

export default angular
    .module('pc.asset.partial.PartialEditorModule', [])
    .directive('pcAssetPartialEditor', () => {
      return {
        controller: PartialEditorCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '=',
          'name': '='
        },
        templateUrl: './asset/partial/partial-editor.ng'
      };
    });
