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
    let globalsJson = JSON.parse(this.asset_.globalsString);
    // TODO(gs): move to $size
    globalsJson._pc = {
      size: {
        height: `${this.asset_.height}px`,
        width: `${this.asset_.width}px`
      }
    };
    return Promise.resolve(globalsJson);
  }
};
