import AceServiceModule from '../thirdparty/ace-service-module';
import CodeEditorCtrl from './code-editor-ctrl';

export function link(
    scope: angular.IScope,
    element: angular.IAugmentedJQuery,
    attr: angular.IAttributes,
    ctrls: any[]): void {
  let [codeEditorCtrl, ngModelCtrl] = ctrls;
  codeEditorCtrl.onLink(element[0].querySelector('.editor'), scope['language'], ngModelCtrl);
};

export default angular
    .module('pc.editor.CodeEditorModule', [
      'ngMaterial',
      AceServiceModule.name,
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
          'readOnly': '@',
        },
        templateUrl: 'src/editor/code-editor.ng',
      };
    });
