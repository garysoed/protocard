/**
 * @fileoverview Controller for the previewable code editor.
 */
 import CodeEditorModule from './code-editor';


export class PreviewableCodeEditorCtrl {
  private language_: string;
  private ngModel_: angular.INgModelController;

  get codeString(): string {
    return this.ngModel_.$viewValue;
  }
  set codeString(newCodeString: string) {
    this.ngModel_.$setViewValue(newCodeString);
  }

  get language(): string {
    return this.language_;
  }
  set language(language: string) {
    this.language_ = language;
  }

  get ngModel(): angular.INgModelController {
    return this.ngModel_;
  }
  set ngModel(ngModel: angular.INgModelController) {
    this.ngModel_ = ngModel;
  }
};

export default angular
    .module('editor.PreviewableCodeEditorModule', [
      CodeEditorModule.name,
    ])
    .component('pcPreviewableCodeEditor', {
      bindings: {
        'language': '@',
      },
      controller: PreviewableCodeEditorCtrl,
      require: {
        'ngModel': 'ngModel',
      },
      templateUrl: 'src/editor/previewable-code-editor.ng',
      transclude: true,
    });
