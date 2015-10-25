const __field__ = Symbol('field');

/**
 * @class settings.FieldEditorCtrl
 */
export default class {
  /**
   * @constructor
   * @param {ng.$scope} $scope
   */
  constructor($scope) {
    this[__field__] = $scope['field'];

    $scope['name'] = this[__field__].name;
    $scope['value'] = this[__field__].value;
  }

  onEditClick() {
    throw Error('unimplemented');
  }

  /**
   * Handler called when the name is changed.
   *
   * @method onNameChange
   * @param {string} newName New name of the field.
   */
  onNameChange(newName) {
    this[__field__].name = newName;
  }

  /**
   * Handler called when the value is changed.
   *
   * @method onValueChange
   * @param {Object} newValue New value of the field.
   */
  onValueChange(newValue) {
    this[__field__].value = newValue;
  }
}
