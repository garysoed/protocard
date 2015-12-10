import Field from './field';
import File from './file';
import FunctionObject from './function-object';
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
    this.data_ = null;
    this.dataProcessor_ = new FunctionObject('return function(lineData) {};');
    this.globalsString_ = JSON.stringify(this.globals_);
    this.helpers_ = {};
    this.images_ = {};
    this.partials_ = {};
    this.templateName_ = '{{_lowercase _.name}}';
    this.templateString_ = '';
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

  get dataProcessor() {
    return this.dataProcessor_;
  }

  /**
   * @property images
   * @type {Object}
   */
  get images() {
    return this.images_;
  }

  get partials() {
    return this.partials_;
  }

  get templateName() {
    return this.templateName_;
  }
  set templateName(templateName) {
    this.templateName_ = templateName;
  }

  /**
   * @property templateString
   * @type {string}
   */
  get templateString() {
    return this.templateString_;
  }
  set templateString(templateString) {
    this.templateString_ = templateString;
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
      dataProcessor: this.dataProcessor_,
      images: Utils.mapValue(this.images_, image => image.toJSON()),
      partials: this.partials,
      templateString: this.templateString
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
    asset.helpers_ = Utils.mapValue(json['helpers'], json => FunctionObject.fromJSON(json));
    asset.data_ = File.fromJSON(json['data']);
    asset.templateString_ = json['templateString'];
    asset.dataProcessor_ = FunctionObject.fromJSON(json['dataProcessor']);

    if (json['images']) {
      if (json['images'] instanceof Array) {
        let set = new Set(json['images'].map(json => ImageResource.fromJSON(json)));
        asset.images_ = {};
        set.forEach(image => {
          asset.images_[image.alias] = image;
        });
      } else {
        asset.images_ = Utils.mapValue(json['images'], json => ImageResource.fromJSON(json));
      }
    }

    asset.partials_ = json['partials'];
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
          && Utils.equals(a.helpers, b.helpers, FunctionObject.equals.bind(FunctionObject))
          && File.equals(a.data, b.data)
          && FunctionObject.equals(a.dataProcessor, b.dataProcessor)
          && Utils.equals(a.images_, b.images_, ImageResource.equals.bind(ImageResource))
          && Utils.equals(a.partials, b.partials)
          && a.templateString === b.templateString;
    }
  }
};
