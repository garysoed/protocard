import { Comparable } from '../decorator/compare';
import { Field, Serializable } from './serializable';

export enum FileTypes {
  UNKNOWN,
  TSV,
  CSV
};

const FILE_TYPE_MAP: Map<FileTypes, string[]> = new Map<FileTypes, string[]>([
  [FileTypes.CSV, ['csv']],
  [FileTypes.TSV, ['tsv']],
]);

@Serializable('File')
export default class File {
  @Field('type') private type_: FileTypes;
  @Field('content') private content_: string;

  /**
   * @param type Type of the file.
   * @param content Content of the file.
   */
  constructor(type: FileTypes = FileTypes.UNKNOWN, content: string = '') {
    this.type_ = type;
    this.content_ = content;
  }

  @Comparable
  get type(): FileTypes {
    return this.type_;
  }

  @Comparable
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
    FILE_TYPE_MAP.forEach((exts: string[], key: FileTypes) => {
      if (exts.indexOf(ext) >= 0) {
        result = key;
      }
    });
    return result;
  }
}
