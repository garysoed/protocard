import AceServiceModule from '../thirdparty/ace-service';


export class CodeEditorCtrl {
  private $element_: HTMLElement;
  private $scope_: angular.IScope;
  private $timeout_: angular.ITimeoutService;
  private aceService_: AceAjax.Ace;
  private editor_: AceAjax.Editor;
  private language_: string;
  private ngModel_: angular.INgModelController;
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
        this.ngModel_.$setViewValue(this.editor_.getValue());
      } else {
        this.ngModel_.$setViewValue(null);
      }
    });
  }

  /**
   * Render function for ngModel.
   */
  private renderModel_(): void {
    this.editor_.setValue(this.ngModel_.$viewValue || '');
    this.editor_.selection.clearSelection();
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

    let session = this.editor_.getSession();
    session.setTabSize(2);
    session.setMode(`ace/mode/${this.language}`);
    session.on('changeAnnotation', this.onEditorChangeAnnotation_.bind(this));

    this.valid_ = session.getAnnotations().length === 0;
    this.ngModel.$render = this.renderModel_.bind(this);
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

  get ngModel(): angular.INgModelController {
    return this.ngModel_;
  }
  set ngModel(ngModel: angular.INgModelController) {
    this.ngModel_ = ngModel;
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
        'language': '@',
        'readonly': '<',
      },
      controller: CodeEditorCtrl,
      require: {
        'ngModel': 'ngModel',
        'ngChange': '?ngChange',
      },
      templateUrl: 'src/editor/code-editor.ng',
    });
