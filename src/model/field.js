/**
 * Represents a field in an arbitrary dictionary.
 *
 * @class data.Field
 */
export default class {
  /**
   * @constructor
   * @param {string} name Name of the field.
   * @param {string|Object} value Value of the field.
   */
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  /**
   * Converts the field to its JSON format.
   *
   * @method toJSON
   * @return {Object} JSON representation of the field.
   */
  toJSON() {
    return {
      name: this.name,
      value: this.value
    };
  }

  /**
   * Parses the given JSON to a field.
   *
   * @method fromJSON
   * @param {Object} json The JSON to parse.
   * @return {data.Field} The field object.
   * @static
   */
  static fromJSON(json) {
    if (!json) {
       return null;
    }

    return new this(json['name'], json['value']);
  }

  /**
   * Tests equality for Field.
   *
   * @method equals
   * @param {Any} a First object to compare.
   * @param {Any} b Second object to compare.
   * @return {Boolean} True if the two objects are equals. False if not, or undefined if one of the
   *    objects is not a Field.
   */
  static equals(a, b) {
    if (a === b) {
      return true;
    }

    if (a instanceof this && b instanceof this) {
      return a.name === b.name
          && a.value === b.value;
    }
  }
};
