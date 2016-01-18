/**
 * @fileoverview Pipeline node for the images.
 */
import Asset from '../model/asset';
import ImageResource from '../model/image-resource';
import Node from './node';

export default class ImageNode extends Node<{ [name: string]: ImageResource }> {
  private asset_: Asset;

  constructor(asset: Asset) {
    super([]);
    this.asset_ = asset;
  }

  runHandler_(): Promise<{ [name: string]: ImageResource }> {
    return Promise.resolve(this.asset_.images);
  }
};
