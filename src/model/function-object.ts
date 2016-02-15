import { Comparable } from '../decorator/compare';
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
  constructor(fnString: string = '') {
    this.fnString_ = fnString;
  }

  /**
   * String representation of the function.
   */
  @Comparable
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
    let expr = `fn = function() { ${this.fnString} };`;
    let fn = null;
    /* tslint:disable:no-eval */
    eval(expr);
    /* tslint:enable:no-eval */
    return fn();
  }
};
