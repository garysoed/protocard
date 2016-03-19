import { Comparable } from '../decorator/compare';
import { Serializable, Field } from '../../node_modules/gs-tools/src/data/a-serializable';

/**
 * Represents an image resource.
 */
@Serializable('ImageResource')
export default class ImageResource {
  @Field('alias') private alias_: string;
  @Field('url') private url_: string;
  @Field('previewUrl') private previewUrl_: string;

  /**
   * @param alias Name of the image resource.
   * @param url URL of the image resource. This will be used for references in HTML / CSS.
   * @param [previewUrl] Preview URL of the image resource. Defaults to the actual URL.
   */
  constructor(alias: string = '', url: string = null, previewUrl: string = url) {
    this.alias_ = alias;
    this.url_ = url;
    this.previewUrl_ = previewUrl;
  }

  /**
   * Name of the image resource.
   */
  @Comparable
  get alias(): string {
    return this.alias_;
  }

  /**
   * URL of the image resource.
   */
  @Comparable
  get url(): string {
    return this.url_;
  }

  /**
   * Preview URL of the image resource.
   */
  @Comparable
  get previewUrl(): string {
    return this.previewUrl_;
  }
};
