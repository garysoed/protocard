import AssetServiceModule from '../../data/asset-service-module';
import CodeEditorModule from '../../editor/code-editor-module';
import GlobalCtrl from './global-ctrl';

export default angular
    .module('pc.asset.subview.GlobalModule', [
      AssetServiceModule.name,
      CodeEditorModule.name
    ])
    .directive('pcAssetGlobal', () => {
      return {
        controller: GlobalCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: './asset/global/global.ng'
      };
    });
