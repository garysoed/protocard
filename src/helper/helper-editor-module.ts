import AssetServiceModule from '../asset/asset-service';
import CodeEditorModule from '../editor/code-editor-module';
import HelperEditorCtrl from './helper-editor-ctrl';

export default angular
    .module('helper.HelperEditorModule', [
      AssetServiceModule.name,
      CodeEditorModule.name,
    ])
    .directive('pcHelperEditor', () => {
      return {
        controller: HelperEditorCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          asset: '=',
          helper: '=',
        },
        templateUrl: 'src/helper/helper-editor.ng',
      };
    });
