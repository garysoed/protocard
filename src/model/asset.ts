import File from './file';
import FunctionObject from './function-object';
import ImageResource from './image-resource';
import Utils from '../utils';

/**
 * Represents an asset.
 *
 * TODO(gs): make common value class.
 */
export default class Asset {

  private id_: string;

  private data_: File;
  private dataProcessor_: FunctionObject;
  private globalsString_: string;
  private helpers_: { [key: string]: FunctionObject };
  private images_: { [key: string]: ImageResource };
  private name_: string;
  private partials_: { [key: string]: FunctionObject };
  private templateName_: string;
  private templateString_: string;

  /**
   * @param name Name of the asset.
   */
  constructor(name) {
    this.id_ = `asset.${Date.now()}`;
    this.name_ = name;
    this.data_ = null;
    this.dataProcessor_ = new FunctionObject('return function(lineData) {};');
    this.globalsString_ = JSON.stringify({});
    this.helpers_ = {};
    this.images_ = {};
    this.partials_ = {};
    this.templateName_ = '{{_lowercase _.name}}';
    this.templateString_ = '';
  }

  get name(): string {
    return this.name_;
  }

  get id(): string {
    return this.id_;
  }

  /**
   * JSON representation of the globals object.
   * WARNING: This method can be very expensive.
   */
  get globals(): {[key: string]: any} {
    return JSON.parse(this.globalsString_);
  }

  /**
   * Helpers for the asset, indexed by the helper function name.
   */
  get helpers(): {[key: string]: FunctionObject} {
    return this.helpers_;
  }

  /**
   * String representation of the globals object.
   */
  get globalsString(): string {
    return this.globalsString_;
  }
  set globalsString(newValue: string) {
    this.globalsString_ = newValue;
  }

  /**
   * Data used to generate the asset.
   */
  get data(): File {
    return this.data_;
  }
  set data(data: File) {
    this.data_ = data;
  }

  get dataProcessor(): FunctionObject {
    return this.dataProcessor_;
  }

  get images(): { [key: string]: ImageResource } {
    return this.images_;
  }

  get partials(): { [key: string]: FunctionObject } {
    return this.partials_;
  }

  get templateName(): string {
    return this.templateName_;
  }
  set templateName(templateName: string) {
    this.templateName_ = templateName;
  }

  get templateString(): string {
    return this.templateString_;
  }
  set templateString(templateString: string) {
    this.templateString_ = templateString;
  }

  /**
   * Converts the asset to its JSON format.
   *
   * @return JSON representation of the asset.
   */
  toJSON(): any {
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
   * @param json The JSON to parse.
   * @return The asset object.
   */
  static fromJSON(json: any): Asset {
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
        let set = new Set(
            <ImageResource[]>json['images'].map(json => ImageResource.fromJSON(json)));
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
