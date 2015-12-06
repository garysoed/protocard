/**
 * @enum {string}
 */
export const Types = {
  UNKNOWN: 'unknown',
  TSV: 'tsv',
  CSV: 'csv'
};

/**
 * @class data.File
 */
export default class {
  /**
   * @constructor
   * @param {data.File.Types} type Type of the file.
   * @param {string} content Content of the file.
   */
  constructor(type, content) {
    this.type_ = type;
    this.content_ = content;
  }

  /**
   * @property type
   * @type {data.File.Types}
   * @readonly
   */
  get type() {
    return this.type_;
  }

  /**
   * @property content
   * @type {string}
   * @readonly
   */
  get content() {
    return this.content_;
  }

  /**
   * Converts the file to its JSON format.
   *
   * @method toJSON
   * @return {Object} JSON representation of the file.
   */
  toJSON() {
    return {
      type: this.type,
      content: this.content
    };
  }

  /**
   * @method getType
   * @param {string} filename Name of the file to infer the filetype from.
   * @return {data.File.Types} Type of file inferred from the filename.
   * @static
   */
  static getType(filename) {
    let fileParts = filename.split('.');
    let ext = fileParts[fileParts.length - 1];
    for (let key in Types) {
      if (ext === Types[key]) {
        return Types[key];
      }
    }
    return Types.UNKNOWN;
  }

  /**
   * Parses the given JSON to file.
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

    return new this(json['type'], json['content']);
  }

  /**
   * Tests equality for File.
   *
   * @method equals
   * @param {Any} a First object to compare.
   * @param {Any} b Second object to compare.
   * @return {Boolean} True if the two objects are equal. False if not, or undefined if one of the
   *    objects is not an File.
   * @static
   */
  static equals(a, b) {
    if (a === b) {
      return true;
    }

    if (a instanceof this && b instanceof this) {
      return a.type === b.type
          && a.content === b.content;
    }
  }
}
