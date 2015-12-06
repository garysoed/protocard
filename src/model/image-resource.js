/**
 * Represents an ImageResource.
 *
 * @class data.ImageResource
 */
export default class {
  /**
   * @constructor
   * @param {string} alias Name of the image resource.
   * @param {string} url URL of the image resource. This will be used for references in HTML / CSS.
   * @param {string} [previewUrl] Preview URL of the image resource. Defaults to the actual URL.
   */
  constructor(alias, url, previewUrl = url) {
    this.alias_ = alias;
    this.url_ = url;
    this.previewUrl_ = previewUrl;
  }

  /**
   * Name of the image resource.
   *
   * @property alias
   * @type {string}
   * @readonly
   */
  get alias() {
    return this.alias_;
  }

  /**
   * URL of the image resource.
   *
   * @property url
   * @type {string}
   * @readonly
   */
  get url() {
    return this.url_;
  }

  /**
   * Preview URL of the image resource.
   *
   * @property previewUrl
   * @type {string}
   * @readonly
   */
  get previewUrl() {
    return this.previewUrl_;
  }

  /**
   * Converts the image resource to its JSON format.
   *
   * @method toJSON
   * @return {Object} JSON representation of the image resource.
   */
  toJSON() {
    return {
      alias: this.alias,
      url: this.url,
      previewUrl: this.previewUrl
    };
  }

  /**
   * Parses the given JSON to image resource.
   *
   * @method fromJSON
   * @param {Object} json The JSON to parse.
   * @return {data.ImageResource} The image resource object.
   * @static
   */
  static fromJSON(json) {
    if (!json) {
      return null;
    }

    return new this(json['alias'], json['url'], json['previewUrl']);
  }

  /**
   * Tests equality for ImageResource.
   *
   * @method equals
   * @param {Any} a First object to compare.
   * @param {Any} b Second object to compare.
   * @return {Boolean} True if the two objects are equal. False if not, or undefined if one of the
   *    objects is not an ImageResource.
   * @static
   */
  static equals(a, b) {
    if (a === b) {
      return true;
    }

    if (a instanceof this && b instanceof this) {
      return a.alias === b.alias
          && a.url === b.url
          && a.previewUrl === b.previewUrl;
    }
  }
};
