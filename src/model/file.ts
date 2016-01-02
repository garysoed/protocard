/// <reference path="../../declaration/es6.d.ts"/>

export enum FileTypes {
  UNKNOWN,
  TSV,
  CSV
};

const FILE_TYPE_MAP: Map<FileTypes, string[]> = new Map<FileTypes, string[]>([
  [FileTypes.CSV, ['csv']],
  [FileTypes.TSV, ['tsv']]
]);

export default class File {
  type_: FileTypes;
  content_: string;

  /**
   * @param type Type of the file.
   * @param content Content of the file.
   */
  constructor(type: FileTypes, content: string) {
    this.type_ = type;
    this.content_ = content;
  }

  get type(): FileTypes {
    return this.type_;
  }

  get content(): string {
    return this.content_;
  }

  /**
   * Converts the file to its JSON format.
   *
   * @return JSON representation of the file.
   */
  toJSON(): any {
    return {
      type: this.type,
      content: this.content
    };
  }

  /**
   * @param filename Name of the file to infer the filetype from.
   * @return Type of file inferred from the filename.
   */
  static getType(filename: string): FileTypes {
    let fileParts = filename.split('.');
    let ext = fileParts[fileParts.length - 1];
    let result = FileTypes.UNKNOWN;
    FILE_TYPE_MAP.forEach((exts, key) => {
      if (exts.indexOf(ext) >= 0) {
        result = key;
      }
    });
    return result;
  }

  /**
   * Parses the given JSON to file.
   *
   * @param json The JSON to parse.
   * @return The file object.
   */
  static fromJSON(json: any): File {
    if (!json) {
      return null;
    }

    return new this(json['type'], json['content']);
  }

  /**
   * Tests equality for File.
   *
   * @param a First object to compare.
   * @param b Second object to compare.
   * @return True if the two objects are equal. False if not, or undefined if one of the
   *    objects is not an File.
   */
  static equals(a: any, b: any): boolean {
    if (a === b) {
      return true;
    }

    if (a instanceof this && b instanceof this) {
      return a.type === b.type
          && a.content === b.content;
    }
  }
}
