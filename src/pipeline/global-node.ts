/**
 * @fileoverview Pipeline node for the globals.
 */
import Asset from '../model/asset';
import Node from './node';

export default class GlobalNode extends Node<{ [key: string]: any }> {
  private asset_: Asset;

  constructor(asset: Asset) {
    super([]);
    this.asset_ = asset;
  }

  runHandler_(): Promise<{ [key: string]: any }> {
    return Promise.resolve(JSON.parse(this.asset_.globalsString));
  }
};
