import AceServiceModule from '../thirdparty/ace-service';
import Records from '../../node_modules/gs-tools/src/collection/records';


export class CodeEditorCtrl {
  private $element_: HTMLElement;
  private $scope_: angular.IScope;
  private $timeout_: angular.ITimeoutService;
  private aceService_: AceAjax.Ace;
  private editor_: AceAjax.Editor;
  private initValue_: string;
  private language_: string;
  private onChange_: (locals: { newValue: string }) => void;
  private readonly_: boolean;
  private valid_: boolean;

  constructor(
      $element: angular.IAugmentedJQuery,
      $scope: angular.IScope,
      $timeout: angular.ITimeoutService,
      AceService: AceAjax.Ace) {
    this.$element_ = $element[0];
    this.$scope_ = $scope;
    this.$timeout_ = $timeout;
    this.aceService_ = AceService;
    this.valid_ = true;
  }

  /**
   * Handler called when the editor's annotation list has changed.
   */
  private onEditorChangeAnnotation_(): void {
    this.$timeout_(() => {
      this.valid_ = !this.editor_.getSession().getAnnotations()
          .some((annotation: { type: string }) => {
            return annotation.type === 'error';
          });
      if (this.valid_) {
        this.onChange({ newValue: this.editor_.getValue() });
      } else {
        this.onChange({ newValue: null });
      }
    });
  }

  $onChanges(changes: { [key: string]: any }): void {
    Records.of(changes).forEach((value: any, key: string) => {
      switch (key) {
        case 'initValue':
          if (this.editor_.getValue() !== this.initValue && this.initValue !== null) {
            this.editor_.setValue(this.initValue || '');
          }
          break;
      }
    });
  }

  $onDestroy(): void {
    this.editor_.destroy();
  }

  $onInit(): void {
    if (this.readonly === undefined) {
      this.readonly = false;
    }

    let editorEl = <HTMLElement> this.$element_.querySelector('.editor');
    this.editor_ = this.aceService_.edit(editorEl);
    this.editor_.setTheme('ace/theme/monokai');

    this.editor_.setReadOnly(this.readonly);
    this.editor_.setShowPrintMargin(!this.readonly);
    this.editor_.renderer.setShowGutter(!this.readonly);

    this.editor_.setValue(this.initValue || '');
    this.editor_.selection.clearSelection();

    let session = this.editor_.getSession();
    session.setTabSize(2);
    session.setMode(`ace/mode/${this.language}`);
    session.on('changeAnnotation', this.onEditorChangeAnnotation_.bind(this));

    this.valid_ = session.getAnnotations().length === 0;
    this.onChange_ = this.onChange_ || function(): void { return; };
  }

  get initValue(): string {
    return this.initValue_;
  }
  set initValue(initValue: string) {
    this.initValue_ = initValue;
  }

  /**
   * True iff the editor value is valid.
   */
  get isValid(): boolean {
    return this.valid_;
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

  get readonly(): boolean {
    return this.readonly_;
  }
  set readonly(readonly: boolean) {
    this.readonly_ = !!readonly;
  }
}

export default angular
    .module('editor.CodeEditorModule', [
      'ngMaterial',
      AceServiceModule.name,
    ])
    .component('pcCodeEditor', {
      bindings: {
        'initValue': '<',
        'language': '@',
        'onChange': '&',
        'readonly': '<',
      },
      controller: CodeEditorCtrl,
      templateUrl: 'src/editor/code-editor.ng',
    });
