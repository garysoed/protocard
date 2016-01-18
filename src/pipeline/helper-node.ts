/**
 * @fileoverview Pipeline node for the helper functions.
 */
import Asset from '../model/asset';
import FunctionObject from '../model/function-object';
import Node from './node';

export default class HelperNode extends Node<{ [key: string]: FunctionObject }> {
  private asset_: Asset;

  constructor(asset: Asset) {
    super([]);
    this.asset_ = asset;
  }

  runHandler_(): Promise<{ [key: string]: FunctionObject }> {
    return Promise.resolve(this.asset_.helpers);
  }
};
