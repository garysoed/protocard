import Asset from '../model/asset';
import Extract from '../convert/extract';
import { FileTypes } from '../model/file';
import Node from './node';

export default class TextNode extends Node<string[][]> {
  private asset_: Asset;

  constructor(asset) {
    super([]);

    this.asset_ = asset;
  }

  runHandler_(): Promise<string[][]> {
    let data = this.asset_.data;
    switch (data.type) {
      case FileTypes.TSV:
        return Promise.resolve(Extract.fromTsv(data.content));
      default:
        throw Error(`Unhandled file type: ${data.type}`);
    }
  }
}
