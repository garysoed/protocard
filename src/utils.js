export default {
  /**
   * Mixes in two objects together.
   *
   * @method mixin
   * @param {Object} fromObj The source object to be mixed in.
   * @param {Object} toObj The destination mixin object.
   */
  mixin(fromObj, toObj) {
    for (let key in fromObj) {
      let value = fromObj[key];
      if (toObj[key] !== undefined) {
        if (typeof toObj[key] !== 'object') {
          // TODO(gs): Trace the object.
          throw Error('Conflict at key ' + key);
        }
        this.mixin(value, toObj[key]);
      } else {
        toObj[key] = JSON.parse(JSON.stringify(value));
      }
    }
  },

  /**
   * Maps the values in the given object.
   *
   * @method mapValue
   * @param {Object} object Object to map the values in.
   * @param {Function} fn Function used to map the value. This function takes in one argument,
   *    which is the value to be mapped, and should return the mapped value.
   * @return {Object} Copy of the input object with the mapped values.
   */
  mapValue(object, fn) {
    let out = {};
    for (let key in object) {
      out[key] = fn(object[key]);
    }
    return out;
  },

  /**
   * Checks equality of the given objects using the given equality function.
   *
   * @method equals
   * @param {Object} a First object to test.
   * @param {Object} b Second object to test.
   * @param {Function} [equalsFn] Function used to test equality. This function should accept two
   *    arguments, which are the two objects to be checked. Defaults to a function checking equality
   *    using `===`.
   * @return {Boolean} True iff the two given objects are equal.
   */
  equals(a, b, equalsFn = (a, b) => a === b) {
    if (equalsFn(a, b)) {
      return true;
    }

    if (typeof a === 'object' && typeof b === 'object') {
      for (let key in a) {
        let aValue = a[key];
        let bValue = b[key];
        if (!this.equals(aValue, bValue, equalsFn)) {
          return false;
        }
      }
      return true;
    } else {
      return equalsFn(a, b);
    }
  }
};
