import CodeEditorModule from './code-editor-module';
import PreviewableCodeEditorCtrl from './previewable-code-editor-ctrl';

export function link(scope, element, attr, ctrls) {
  let previewableCodeEditorCtrl: PreviewableCodeEditorCtrl = ctrls[0];
  let ngModelCtrl: angular.INgModelController = ctrls[1];
  previewableCodeEditorCtrl.onLink(ngModelCtrl);
}

export default angular
    .module('pc.editor.PreviewableCodeEditorModule', [
      CodeEditorModule.name
    ])
    .directive('pcPreviewableCodeEditor', () => {
      return {
        controller: PreviewableCodeEditorCtrl,
        controllerAs: 'ctrl',
        link: link,
        require: ['pcPreviewableCodeEditor', 'ngModel'],
        restrict: 'E',
        scope: {
          'language': '@'
        },
        templateUrl: './editor/previewable-code-editor.ng',
        transclude: true
      };
    });
