import AssetServiceModule from '../../asset/asset-service-module';
import CodeEditorModule from '../../editor/code-editor-module';
import HelperEditorCtrl from './helper-editor-ctrl';

export default angular
    .module('pc.asset.subview.HelperEditorModule', [
      AssetServiceModule.name,
      CodeEditorModule.name
    ])
    .directive('pcAssetHelperEditor', () => {
      return {
        controller: HelperEditorCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          asset: '=',
          helper: '='
        },
        templateUrl: './asset/helper/helper-editor.ng'
      };
    });
