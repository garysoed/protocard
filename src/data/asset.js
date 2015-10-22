import RawSource from './raw-source';

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
     */
    this.id = `asset.${Date.now()}`;

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
      source: this.source ? this.source.toJSON() : null
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
    asset.id = json['id'];
    asset.source = RawSource.fromJSON(json['source']);
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
          && RawSource.equals(a.source, b.source);
    }
  }
};
