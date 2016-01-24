export const IDS = {};

// TODO(gs): Move to util folder.
// TODO(gs): Split into different files.

export default {
  /**
   * Generates a key that is not a key in the given object.
   *
   * @param object Object containing keys that the newly generated key should not conflict with.
   * @param prefix Prefix of key to generate.
   * @return Key with the given prefix that does not conflict with the keys in the given
   *    object.
   */
  generateKey(object: any, prefix: string): string {
    let index = 0;
    let guess = prefix;

    while (object[guess] !== undefined) {
      guess = `${prefix}_${index}`;
      index++;
    }
    return guess;
  },

  /**
   * Generates an ID that has never been generated before.
   *
   * @param prefix Prefix of the ID to generate.
   * @return Newly generated unique ID.
   */
  getUniqueId(prefix: string): string {
    let newId = this.generateKey(IDS, prefix);
    IDS[newId] = newId;
    return newId;
  },

  /**
   * Mixes in two objects together.
   *
   * @param fromObj The source object to be mixed in.
   * @param toObj The destination mixin object.
   */
  mixin(fromObj: any, toObj: any) {
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
   * @param object Object to map the values in.
   * @param fn Function used to map the value. This function takes in one argument,
   *    which is the value to be mapped, and should return the mapped value.
   * @return Copy of the input object with the mapped values.
   */
  mapValue<V1, V2>(object: {[key: string]: V1}, fn: (V1) => V2): {[key: string]: V2} {
    let out = <{[key: string]: V2}>{};
    for (let key in object) {
      out[key] = fn(object[key]);
    }
    return out;
  },

  /**
   * Checks equality of the given objects using the given equality function.
   *
   * @param a First object to test.
   * @param b Second object to test.
   * @param [equalsFn] Function used to test equality. This function should accept two
   *    arguments, which are the two objects to be checked. Defaults to a function checking equality
   *    using `===`.
   * @return True iff the two given objects are equal.
   */
  equals(a: any, b: any, equalsFn = (a, b) => a === b): boolean {
    if (equalsFn(a, b)) {
      return true;
    }

    if (a instanceof Set && b instanceof Set) {
      let arrayA = Array.from(a);
      let arrayB = Array.from(b);

      if (arrayA.length !== arrayB.length) {
        return false;
      }

      return arrayA.every(itemA => {
        return arrayB.some(itemB => {
          return equalsFn(itemA, itemB);
        });
      });
    } else if (typeof a === 'object' && typeof b === 'object') {
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
