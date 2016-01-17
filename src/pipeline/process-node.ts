import Asset from '../model/asset';
import Node from './node';
import TextNode from './text-node';
import Writer from '../convert/writer';

export default class ProcessNode extends Node<any[]> {
  private asset_: Asset;

  constructor(asset: Asset, textNode: TextNode) {
    super([textNode]);

    this.asset_ = asset;
  }

  runHandler_(results: any[]): Promise<any[]> {
    let writer = new Writer(<string[][]>results[0]);
    let mapFunction = <(data: string[], line: number) => any>this.asset_.dataProcessor.asFunction();
    return Promise.resolve(writer.write(mapFunction));
  }
}
