const __namespace__ = Symbol('namespace');
const __storage__ = Symbol('storage');

/**
 * Service to manage local storage.
 *
 * @class common.StorageService
 */
export default class {

  /**
   * @constructor
   * @param {Window} $window The window object.
   * @param {string} namespace Namespace of the storage.
   */
  constructor($window, namespace) {
    this[__storage__] = $window.localStorage;
    this[__namespace__] = namespace;
  }

  /**
   * @method getItem
   * @param {string} key Key of the item to be returned.
   * @param {Function} ctor Constructor of the item to be returned.
   * @param {Any} [defaultValue] Default value to return if the key cannot be found. Defaults to
   *    null.
   * @return {Any} The stored value corresponding to the given key. If the constructor has a
   *    fromJSON method, this method will use that method to deserialize the JSON. Otherwise, this
   *    will return the JSON.
   */
  getItem(key, ctor, defaultValue = null) {
    let value = this[__storage__].getItem(`${this[__namespace__]}.${key}`);

    if (value === null) {
      return defaultValue;
    } else {
      let json = JSON.parse(value);
      return (typeof ctor.fromJSON === 'function') ? ctor.fromJSON(json) : json;
    }
  }

  /**
   * Stores the given iteam in the storage.
   *
   * @method setItem
   * @param {string} key Key to store the item in.
   * @param {Any} item The item to be stored.
   */
  setItem(key, item) {
    this[__storage__].setItem(`${this[__namespace__]}.${key}`, JSON.stringify(item));
  }
};
