import Field from './field';
import File from './file';
import Helper from './helper';
import ImageResource from './image-resource';
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
    this.globalsString_ = JSON.stringify(this.globals_);
    this.helpers_ = {};
    this.data_ = null;
    this.images_ = new Set([]);
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
   * Helpers for the asset, indexed by the helper function name.
   *
   * @property helpers
   * @type {Object}
   * @readonly
   */
  get helpers() {
    return this.helpers_;
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
   * Data used to generate the asset.
   *
   * @property data
   * @type {data.File}
   */
  get data() {
    return this.data_;
  }
  set data(data) {
    this.data_ = data;
  }

  /**
   * @property images
   * @type {Set}
   */
  get images() {
    return this.images_;
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
      globals: this.globalsString,
      helpers: Utils.mapValue(this.helpers, helper => helper.toJSON()),
      data: this.data ? this.data.toJSON() : null,
      images: Array.from(this.images_).map(image => image.toJSON())
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
    asset.globalsString = json['globals'];
    asset.helpers_ = Utils.mapValue(json['helpers'], json => Helper.fromJSON(json));
    asset.data_ = File.fromJSON(json['data']);

    if (json['images']) {
      asset.images_ = new Set(json['images'].map(json => ImageResource.fromJSON(json)));
    }
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
   * @static
   */
  static equals(a, b) {
    if (a === b) {
      return true;
    }

    if (a instanceof this && b instanceof this) {
      return a.id === b.id
          && a.name === b.name
          && Utils.equals(a.globalsString, b.globalsString)
          && Utils.equals(a.helpers, b.helpers)
          && File.equals(a.data, b.data)
          && Utils.equals(a.images_, b.images_, ImageResource.equals.bind(ImageResource));
    }
  }
};
