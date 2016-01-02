import { Serializable, Field } from './serializable';

/**
 * Represents a function.
 */
@Serializable('FunctionObject')
export default class FunctionObject {

  @Field('fnString') private fnString_: string;

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
