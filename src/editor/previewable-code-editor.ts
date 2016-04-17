/**
 * @fileoverview Controller for the previewable code editor.
 */
 import CodeEditorModule from './code-editor';


export class PreviewableCodeEditorCtrl {
  private language_: string;
  private ngModelCtrl_: angular.INgModelController;

  constructor($scope: angular.IScope) {
    this.language_ = $scope['language'];
    this.ngModelCtrl_ = null;
  }

  get codeString(): string {
    return this.ngModelCtrl_.$viewValue;
  }
  set codeString(newCodeString: string) {
    this.ngModelCtrl_.$setViewValue(newCodeString);
  }

  get language(): string {
    return this.language_;
  }

  onLink(ngModelCtrl: angular.INgModelController): void {
    this.ngModelCtrl_ = ngModelCtrl;
  }
};


function link(
    scope: angular.IScope,
    element: angular.IAugmentedJQuery,
    attr: angular.IAttributes,
    ctrls: any[]): void {
  let previewableCodeEditorCtrl: PreviewableCodeEditorCtrl = ctrls[0];
  let ngModelCtrl: angular.INgModelController = ctrls[1];
  previewableCodeEditorCtrl.onLink(ngModelCtrl);
}

export default angular
    .module('editor.PreviewableCodeEditorModule', [
      CodeEditorModule.name,
    ])
    .directive('pcPreviewableCodeEditor', () => {
      return {
        controller: PreviewableCodeEditorCtrl,
        controllerAs: 'ctrl',
        link: link,
        require: ['pcPreviewableCodeEditor', 'ngModel'],
        restrict: 'E',
        scope: {
          'language': '@',
        },
        templateUrl: 'src/editor/previewable-code-editor.ng',
        transclude: true,
      };
    });
