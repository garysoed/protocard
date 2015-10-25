import Field from '../data/field';
import Utils from '../utils';

const __$mdDialog__ = Symbol('$mdDialog');
const __globals__ = Symbol('globals');

/**
 * @class settings.EditGlobalsDialogCtrl
 */
export default class {
  /**
   * @constructor
   */
  constructor($mdDialog, globals) {
    this[__$mdDialog__] = $mdDialog;
    this[__globals__] = Utils.mapValue(globals, field => Field.fromJSON(field.toJSON()));
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
}
