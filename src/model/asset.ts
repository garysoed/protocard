import Comparator from '../decorators/compare';
import File from './file';
import FunctionObject from './function-object';
import ImageResource from './image-resource';
import Serializer, { Serializable, Field } from './serializable';
import Utils from '../utils';

/**
 * Represents an asset.
 *
 * TODO(gs): make common value class.
 */
@Serializable('Asset')
export default class Asset {

  @Field('data') private data_: File;
  @Field('dataProcessor') private dataProcessor_: FunctionObject;
  @Field('globals') private globalsString_: string;
  @Field('helpers') private helpers_: { [key: string]: FunctionObject };
  @Field('id') private id_: string;
  @Field('images') private images_: { [key: string]: ImageResource };
  @Field('name') private name_: string;
  @Field('partials') private partials_: { [key: string]: string };
  private templateName_: string;
  @Field('templateString') private templateString_: string;

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

  get partials(): { [key: string]: string } {
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
          && Utils.equals(a.helpers, b.helpers, Comparator.equals.bind(Comparator))
          && Comparator.equals(a.data, b.data)
          && Comparator.equals(a.dataProcessor, b.dataProcessor)
          && Utils.equals(a.images_, b.images_, Comparator.equals.bind(Comparator))
          && Utils.equals(a.partials, b.partials)
          && a.templateString === b.templateString;
    }
  }
};
