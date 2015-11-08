/**
 * @class editor.CodeEditorCtrl
 */
export default class {
  /**
   * @constructor
   * @param {ng.$scope} $scope
   * @param {ng.$timeout} $timeout
   * @param {thirdparty.AceService} AceService
   */
  constructor($scope, $timeout, AceService) {
    this.$timeout_ = $timeout;
    this.aceService_ = AceService;
    this.editor_ = null;
    this.ngModelCtrl_ = null;
    this.valid_ = true;

    $scope.$on('$destroy', this.on$destroy_.bind(this));
  }

  /**
   * Handler called when the ctrl is destroy.
   *
   * @method on$destroy_
   * @private
   */
  on$destroy_() {
    this.editor_.destroy();
  }

  /**
   * Handler called when the editor's annotation list has changed.
   *
   * @method onEditorChangeAnnotation_
   * @private
   */
  onEditorChangeAnnotation_() {
    this.$timeout_(() => {
      this.valid_ = this.editor_.getSession().getAnnotations().length === 0;
      if (this.valid_) {
        this.ngModelCtrl_.$setViewValue(this.editor_.getValue());
      } else {
        this.ngModelCtrl_.$setViewValue(null);
      }
    });
  }

  /**
   * Render function for ngModel.
   *
   * @method renderModel_
   * @private
   */
  renderModel_() {
    this.editor_.setValue(this.ngModelCtrl_.$viewValue || '');
    this.editor_.selection.clearSelection();
  }

  /**
   * True iff the editor value is valid.
   *
   * @property isValid
   * @type {Boolean}
   * @readonly
   */
  get isValid() {
    return this.valid_;
  }

  /**
   * Handler called when the controller is linked.
   *
   * @method onLink
   * @param {Element} editorEl The editor container element.
   * @param {string} language The language to set the editor.
   * @param {ng.ngModelController} ngModelCtrl
   */
  onLink(editorEl, language, ngModelCtrl) {
    this.editor_ = this.aceService_.edit(editorEl);
    this.editor_.setTheme('ace/theme/monokai');

    let session = this.editor_.getSession();
    session.setTabSize(2);
    session.setMode(`ace/mode/${language}`);
    session.on('changeAnnotation', this.onEditorChangeAnnotation_.bind(this));

    this.valid_ = session.getAnnotations().length === 0;

    this.ngModelCtrl_ = ngModelCtrl;
    ngModelCtrl.$render = this.renderModel_.bind(this);
  }
};
