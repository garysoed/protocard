import Field from '../data/field';

const __object__ = Symbol('object');

/**
 * @class settings.ObjectEditor
 */
export default class {
  /**
   * @constructor
   */
  constructor($scope) {
    this[__object__] = $scope['object'];
  }

  /**
   * @method getFields
   * @return {Object} Object containing the fields to be edited.
   */
  getFields() {
    return this[__object__];
  }

  /**
   * Handler called when the add button is clicked.
   *
   * @method onAddClick
   */
  onAddClick() {
    let newKey = `Field ${Date.now()}`;
    let newField = new Field(newKey, '');
    this[__object__][newKey] = newField;
  }
}
