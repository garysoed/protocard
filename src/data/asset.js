import Field from './field';
import RawSource from './raw-source';
import Utils from '../utils';

const __id__ = Symbol('id');

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
    /**
     * @property id
     * @type {string}
     * @readonly
     */
    this[__id__] = `asset.${Date.now()}`;

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

    /**
     * @property globals
     * @type {Object}
     */
    this.globals = {};
  }

  get id() {
    return this[__id__];
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
      globals: Utils.mapValue(this.globals, field => field.toJSON())
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
    asset[__id__] = json['id'];
    asset.source = RawSource.fromJSON(json['source']);
    asset.globals = Utils.mapValue(json['globals'], json => Field.fromJSON(json));
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
          && Utils.equals(a.globals, b.globals, Field.equals.bind(Field));
    }
  }
};
