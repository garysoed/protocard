import CodeEditorModule from '../../editor/code-editor-module';
import DataCtrl from './data-ctrl';

export default angular
    .module('pc.asset.data.DataModule', [
      CodeEditorModule.name
    ])
    .directive('pcAssetData', () => {
      return {
        controller: DataCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: './asset/data/data.ng'
      };
    });
