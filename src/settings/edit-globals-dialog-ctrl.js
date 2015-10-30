import Field from '../data/field';
import Utils from '../utils';

const __$mdDialog__ = Symbol('$mdDialog');
const __editFields__ = Symbol('editFields');
const __globals__ = Symbol('globals');
const __selectedTab__ = Symbol('selectedTab');

/**
 * @class settings.EditGlobalsDialogCtrl
 */
export default class {
  /**
   * @constructor
   */
  constructor($mdDialog, $scope, globals) {
    this[__$mdDialog__] = $mdDialog;
    this[__editFields__] = [];
    this[__globals__] = Utils.mapValue(globals, field => Field.fromJSON(field.toJSON()));

    $scope.$on('navigate-object', this.onNavigateObject.bind(this));
  }

  getEditFields() {
    return this[__editFields__];
  }

  /**
   * @method getGlobals
   * @return {Object} Object containing the globals.
   */
  getGlobals() {
    return this[__globals__];
  }

  /**
   * Handler called when the save button is clicked.
   *
   * @method onSaveClick
   */
  onSaveClick() {
    this[__$mdDialog__].hide(this[__globals__]);
  }

  /**
   * Handler called when the cancel button is clicked.
   *
   * @method onCancelClick
   */
  onCancelClick() {
    this[__$mdDialog__].cancel();
  }

  onNavigateObject(event, field, index) {
    if (this[__editFields__].length > index) {
      this[__editFields__][index] = field;
      this[__editFields__]
    } else {
      this[__editFields__].push(field);
    }
  }
}
