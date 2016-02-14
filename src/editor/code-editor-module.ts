import AceServiceModule from '../thirdparty/ace-service-module';
import CodeEditorCtrl from './code-editor-ctrl';

export function link(scope, element, attr, ctrls) {
  let [codeEditorCtrl, ngModelCtrl] = ctrls;
  codeEditorCtrl.onLink(element[0].querySelector('.editor'), scope['language'], ngModelCtrl);
};

export default angular
    .module('pc.editor.CodeEditorModule', [
      'ngMaterial',
      AceServiceModule.name
    ])
    .directive('pcCodeEditor', () => {
      return {
        controller: CodeEditorCtrl,
        controllerAs: 'ctrl',
        link: link,
        require: ['pcCodeEditor', 'ngModel', '?ngChange'],
        restrict: 'E',
        scope: {
          'language': '@',
          'readOnly': '@'
        },
        templateUrl: './editor/code-editor.ng'
      };
    });
