import { Comparable } from '../decorators/compare';
import File from './file';
import FunctionObject from './function-object';
import ImageResource from './image-resource';
import Serializer, { Serializable, Field } from './serializable';
import Utils from '../utils';

/**
 * Represents an asset.
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
  @Field('templateName') private templateName_: string;
  @Field('templateString') private templateString_: string;

  /**
   * @param name Name of the asset.
   */
  constructor(name) {
    this.id_ = `asset.${Date.now()}`;
    this.name_ = name;
    this.data_ = null;
    this.dataProcessor_ = new FunctionObject('return function(lineData) { return lineData; };');
    this.globalsString_ = JSON.stringify({});
    this.helpers_ = {};
    this.images_ = {};
    this.partials_ = {};
    this.templateName_ = '';
    this.templateString_ = '';
  }

  @Comparable
  get name(): string {
    return this.name_;
  }
  set name(name: string) {
    this.name_ = name;
  }

  @Comparable
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
  @Comparable
  get globalsString(): string {
    return this.globalsString_;
  }
  set globalsString(newValue: string) {
    this.globalsString_ = newValue;
  }

  /**
   * Data used to generate the asset.
   */
  @Comparable
  get data(): File {
    return this.data_;
  }
  set data(data: File) {
    this.data_ = data;
  }

  @Comparable
  get dataProcessor(): FunctionObject {
    return this.dataProcessor_;
  }

  @Comparable
  get images(): { [key: string]: ImageResource } {
    return this.images_;
  }

  @Comparable
  get partials(): { [key: string]: string } {
    return this.partials_;
  }

  @Comparable
  get templateName(): string {
    return this.templateName_;
  }
  set templateName(templateName: string) {
    this.templateName_ = templateName;
  }

  @Comparable
  get templateString(): string {
    return this.templateString_;
  }
  set templateString(templateString: string) {
    this.templateString_ = templateString;
  }
};
