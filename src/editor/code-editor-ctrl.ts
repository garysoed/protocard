export default class CodeEditorCtrl {
  private $scope_: angular.IScope;
  private $timeout_: angular.ITimeoutService;
  private aceService_: AceAjax.Ace;
  private editor_: AceAjax.Editor;
  private ngModelCtrl_: angular.INgModelController;
  private valid_: boolean;

  constructor(
      $scope: angular.IScope,
      $timeout: angular.ITimeoutService,
      AceService: AceAjax.Ace) {
    this.$scope_ = $scope;
    this.$timeout_ = $timeout;
    this.aceService_ = AceService;
    this.editor_ = null;
    this.ngModelCtrl_ = null;
    this.valid_ = true;

    $scope.$on('$destroy', this.on$destroy_.bind(this));
  }

  /**
   * Handler called when the ctrl is destroy.
   */
  private on$destroy_() {
    this.editor_.destroy();
  }

  /**
   * Handler called when the editor's annotation list has changed.
   */
  private onEditorChangeAnnotation_() {
    this.$timeout_(() => {
      this.valid_ = !this.editor_.getSession().getAnnotations().some(annotation => {
        return annotation.type === 'error';
      });
      if (this.valid_) {
        this.ngModelCtrl_.$setViewValue(this.editor_.getValue());
      } else {
        this.ngModelCtrl_.$setViewValue(null);
      }
    });
  }

  /**
   * Render function for ngModel.
   */
  private renderModel_() {
    this.editor_.setValue(this.ngModelCtrl_.$viewValue || '');
    this.editor_.selection.clearSelection();
  }

  /**
   * True iff the editor value is valid.
   */
  get isValid(): boolean {
    return this.valid_;
  }

  /**
   * Handler called when the controller is linked.
   * @param editorEl The editor container element.
   * @param language The language to set the editor.
   * @param ngModelCtrl
   */
  onLink(editorEl: HTMLElement, language: string, ngModelCtrl: angular.INgModelController) {
    this.editor_ = this.aceService_.edit(editorEl);
    this.editor_.setTheme('ace/theme/monokai');

    let readonly = !!this.$scope_['readOnly'];
    this.editor_.setReadOnly(readonly);
    this.editor_.setShowPrintMargin(!readonly);
    this.editor_.renderer.setShowGutter(!readonly);

    let session = this.editor_.getSession();
    session.setTabSize(2);
    session.setMode(`ace/mode/${language}`);
    session.on('changeAnnotation', this.onEditorChangeAnnotation_.bind(this));

    this.valid_ = session.getAnnotations().length === 0;

    this.ngModelCtrl_ = ngModelCtrl;
    ngModelCtrl.$render = this.renderModel_.bind(this);
  }
};
