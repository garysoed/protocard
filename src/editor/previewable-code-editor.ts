/**
 * @fileoverview Controller for the previewable code editor.
 */
 import CodeEditorModule from './code-editor';


export class PreviewableCodeEditorCtrl {
  private initValue_: string;
  private language_: string;
  private onChange_: (locals: { newValue: string }) => void;

  get initValue(): string {
    return this.initValue_;
  }
  set initValue(initValue: string) {
    this.initValue_ = initValue;
  }

  get language(): string {
    return this.language_;
  }
  set language(language: string) {
    this.language_ = language;
  }

  get onChange(): (locals: { newValue: string }) => void {
    return this.onChange_;
  }
  set onChange(onChange: (locals: { newValue: string }) => void) {
    this.onChange_ = onChange;
  }

  onCodeChange(newValue: string): void {
    this.onChange_({ newValue: newValue });
  }
};

export default angular
    .module('editor.PreviewableCodeEditorModule', [
      CodeEditorModule.name,
    ])
    .component('pcPreviewableCodeEditor', {
      bindings: {
        'initValue': '<',
        'language': '@',
        'onChange': '&',
      },
      controller: PreviewableCodeEditorCtrl,
      templateUrl: 'src/editor/previewable-code-editor.ng',
      transclude: true,
    });
