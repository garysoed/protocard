/**
 * Represents an image resource.
 */
export default class ImageResource {
  private alias_: string;
  private url_: string;
  private previewUrl_: string;

  /**
   * @param alias Name of the image resource.
   * @param url URL of the image resource. This will be used for references in HTML / CSS.
   * @param [previewUrl] Preview URL of the image resource. Defaults to the actual URL.
   */
  constructor(alias: string, url: string, previewUrl = url) {
    this.alias_ = alias;
    this.url_ = url;
    this.previewUrl_ = previewUrl;
  }

  /**
   * Name of the image resource.
   */
  get alias(): string {
    return this.alias_;
  }

  /**
   * URL of the image resource.
   */
  get url(): string {
    return this.url_;
  }

  /**
   * Preview URL of the image resource.
   */
  get previewUrl(): string {
    return this.previewUrl_;
  }

  /**
   * Converts the image resource to its JSON format.
   *
   * @return The JSON representation of the image resource.
   */
  toJSON(): any {
    return {
      alias: this.alias,
      url: this.url,
      previewUrl: this.previewUrl
    };
  }

  /**
   * Parses the given JSON to image resource.
   *
   * @param json The JSON to parse.
   * @return The image resource object.
   */
  static fromJSON(json: any): ImageResource {
    if (!json) {
      return null;
    }

    return new this(json['alias'], json['url'], json['previewUrl']);
  }

  /**
   * Tests equality for ImageResource.
   *
   * @param a First object to compare.
   * @param b Second object to compare.
   * @return True if the two objects are equal. False if not, or undefined if one of the
   *    objects is not an ImageResource.
   */
  static equals(a: any, b: any): boolean {
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
