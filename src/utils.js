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
  }
};
