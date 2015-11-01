import AceServiceModule from '../thirdparty/ace-service-module';
import CodeEditorCtrl from './code-editor-ctrl';

export default angular
    .module('pc.editor.CodeEditorModule', [
      'ngMaterial',
      AceServiceModule.name
    ])
    .directive('pcCodeEditor', (AceService) => {
      return {
        controller: CodeEditorCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
        },
        templateUrl: './editor/code-editor.ng',
        link: function(scope, element) {

        }
      };
    });
