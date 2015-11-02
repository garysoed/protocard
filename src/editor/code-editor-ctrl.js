/**
 * Types of events dispatched by the editor.CodeEditorCtrl.
 * TODO(gs): Make the id unique.
 * @enum {string}
 */
export const Events = {
  SAVE: 'save'
};

/**
 * @class editor.CodeEditorCtrl
 */
export default class {
  /**
   * @constructor
   * @param {ng.$scope} $scope
   * @param {thirdparty.AceService} AceService
   */
  constructor($scope, AceService) {
    this.$scope_ = $scope;
    this.aceService_ = AceService;
    this.editor_ = null;
    this.ngModelCtrl_ = null;
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

    this.editor_.getSession().setTabSize(2);
    this.editor_.getSession().setMode(`ace/mode/${language}`);

    this.ngModelCtrl_ = ngModelCtrl;
    ngModelCtrl.$render = this.renderModel_.bind(this);
  }

  /**
   * Handler called when the save button is clicked.
   *
   * @method onSaveClick
   */
  onSaveClick() {
    this.ngModelCtrl_.$setViewValue(this.editor_.getValue());
    this.$scope_.$emit(Events.SAVE);
  }
};
