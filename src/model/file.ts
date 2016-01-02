import { Serializable, Field } from './serializable';

export enum FileTypes {
  UNKNOWN,
  TSV,
  CSV
};

const FILE_TYPE_MAP: Map<FileTypes, string[]> = new Map<FileTypes, string[]>([
  [FileTypes.CSV, ['csv']],
  [FileTypes.TSV, ['tsv']]
]);

@Serializable('File')
export default class File {
  @Field('type') private type_: FileTypes;
  @Field('content') private content_: string;

  /**
   * @param type Type of the file.
   * @param content Content of the file.
   */
  constructor(type = FileTypes.UNKNOWN, content = '') {
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
