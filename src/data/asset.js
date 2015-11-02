import Field from './field';
import RawSource from './raw-source';
import Utils from '../utils';

/**
 * Represents an asset.
 *
 * TODO(gs): make common value class.
 *
 * @class data.Asset
 */
export default class {

  /**
   * @constructor
   * @param {string} name Name of the asset.
   */
  constructor(name) {
    this.id_ = `asset.${Date.now()}`;

    /**
     * @property name
     * @type {string}
     */
    this.name = name;

    /**
     * @property source
     * @type {data.RawSource}
     */
    this.source = null;
    this.globalsString_ = JSON.stringify(this.globals_);
  }

  /**
   * @property id
   * @type {string}
   * @readonly
   */
  get id() {
    return this.id_;
  }

  /**
   * JSON representation of the globals object.
   * WARNING: This method can be very expensive.
   *
   * @property globals
   * @type {Object}
   * @readonly
   */
  get globals() {
    return JSON.parse(this.globalsString_);
  }

  /**
   * String representation of the globals object.
   *
   * @property globalsString
   * @type {string}
   */
  get globalsString() {
    return this.globalsString_;
  }
  set globalsString(newValue) {
    this.globalsString_ = newValue;
  }

  /**
   * Converts the asset to its JSON format.
   *
   * @method toJSON
   * @return {Object} JSON representation of the asset.
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      source: this.source ? this.source.toJSON() : null,
      globals: this.globalsString
    };
  }

  /**
   * Parses the given JSON to asset.
   *
   * @method fromJSON
   * @param {Object} json The JSON to parse.
   * @return {data.Asset} The asset object.
   * @static
   */
  static fromJSON(json) {
    if (!json) {
      return null;
    }

    let asset = new this(json['name']);
    asset.id_ = json['id'];
    asset.source = RawSource.fromJSON(json['source']);
    asset.globalsString = json['globals'];
    return asset;
  }

  /**
   * Tests equality for Asset.
   *
   * @method equals
   * @param {Any} a First object to compare.
   * @param {Any} b Second object to compare.
   * @return {Boolean} True if the two objects are equal. False if not, or undefined if one of the
   *    objects is not an Asset.
   */
  static equals(a, b) {
    if (a === b) {
      return true;
    }

    if (a instanceof this && b instanceof this) {
      return a.id === b.id
          && a.name === b.name
          && RawSource.equals(a.source, b.source)
          && Utils.equals(a.globals, b.globals);
    }
  }
};
