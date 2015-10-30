const __$scope__ = Symbol('$scope');
const __field__ = Symbol('field');
const __index__ = Symbol('index');

/**
 * @class settings.FieldEditorCtrl
 */
export default class {
  /**
   * @constructor
   * @param {ng.$scope} $scope
   */
  constructor($scope) {
    this[__$scope__] = $scope;
    this[__field__] = $scope['field'];
    this[__index__] = $scope['index'];

    $scope['name'] = this[__field__].name;
    $scope['value'] = this[__field__].value;
    $scope['isObject'] = this[__field__].value instanceof Object;
  }

  isObject() {
    return this[__field__].value instanceof Object;
  }

  onEditClick() {
    this[__$scope__].$emit('navigate-object', this[__field__], this[__index__]);
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

  onObjectChange(isObject) {
    this[__field__].value = isObject ? {} : '';
    // TODO(gs): Emit event when turning off object.
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
