import CodeEditorModule from './code-editor-module';
import TemplateEditorCtrl from './template-editor-ctrl';

function link(scope, element, attr, ctrls) {
  let [templateEditorCtrl, ngModelCtrl] = ctrls;
  templateEditorCtrl.onLink(element[0].querySelector('iframe'), ngModelCtrl);
}

export default angular
    .module('pc.editor.TemplateEditorModule', [
      CodeEditorModule.name
    ])
    .directive('pcTemplateEditor', () => {
      return {
        controller: TemplateEditorCtrl,
        controllerAs: 'ctrl',
        require: ['pcTemplateEditor', 'ngModel'],
        restrict: 'E',
        scope: {
          asset: '=',
          sampleData: '='
        },
        templateUrl: './editor/template-editor.ng',
        link: link
      };
    });
