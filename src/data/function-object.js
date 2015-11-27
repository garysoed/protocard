/**
 * Represents a function.
 *
 * @class FunctionObject
 */
export default class {

  /**
   * @constructor
   * @param {string} name Name of the helper function.
   */
  constructor() {

    /**
     * @property fnString
     * @type {string}
     */
    this.fnString = 'return function() {};';
  }

  /**
   * @method asFunction
   * @return {Function} The helper function has an executable function object.
   */
  asFunction() {
    let expr = `fn = function() { ${this.fnString} };`
    let fn = null;
    let result = eval(expr);
    return fn();
  }

  /**
   * Converts the helper function to its JSON format.
   *
   * @method toJSON
   * @return {Object} JSON representation of the Helper function.
   */
  toJSON() {
    return {
      fnString: this.fnString
    };
  }

  /**
   * Parses the given JSON to helper function.
   *
   * @method fromJSON
   * @param {Object} json The JSON object to be parsed.
   * @return {Helper} The parsed Helper object.
   * @static
   */
  static fromJSON(json) {
    if (!json) {
      return null;
    }

    let fn = new this();
    fn.fnString = json['fnString'];
    return fn;
  }

  /**
   * Tests equality for Helper.
   *
   * @method equals
   * @param {Any} a First object to compare.
   * @param {Any} b Second object to compare.
   * @return {Boolean} True if the two objects are equal. False if not, or undefined if one of the
   *    objects is not an Asset.
   * @static
   */
  static equals(a, b) {
    if (a === b) {
      return true;
    }

    if (a instanceof this && b instanceof this) {
      return a.fnString === b.fnString;
    }
  }
};
