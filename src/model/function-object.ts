/**
 * Represents a function.
 */
export default class FunctionObject {

  private fnString_: string;

  /**
   * @param [fnString] Initial value of the function string.
   */
  constructor(fnString = '') {
    this.fnString_ = fnString;
  }

  /**
   * String representation of the function.
   */
  get fnString(): string {
    return this.fnString_;
  }
  set fnString(fnString: string) {
    this.fnString_ = fnString;
  }

  /**
   * @return The helper function has an executable function object.
   */
  asFunction(): Function {
    let expr = `fn = function() { ${this.fnString} };`
    let fn = null;
    let result = eval(expr);
    return fn();
  }

  /**
   * Converts the helper function to its JSON format.
   *
   * @return JSON representation of the Helper function.
   */
  toJSON(): any {
    return {
      fnString: this.fnString
    };
  }

  /**
   * Parses the given JSON to helper function.
   *
   * @param json The JSON object to be parsed.
   * @return The parsed FunctionObject object.
   */
  static fromJSON(json: any): FunctionObject {
    if (!json) {
      return null;
    }

    let fn = new this();
    fn.fnString = json['fnString'];
    return fn;
  }

  /**
   * Tests equality for FunctionObject.
   *
   * @param a First object to compare.
   * @param b Second object to compare.
   * @return True if the two objects are equal. False if not, or undefined if one of the objects is
   *    not a FunctionObject.
   */
  static equals(a: any, b: any): boolean {
    if (a === b) {
      return true;
    }

    if (a instanceof this && b instanceof this) {
      return a.fnString === b.fnString;
    }
  }
};
