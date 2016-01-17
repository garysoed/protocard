import Asset from '../model/asset';
import Cache from '../decorators/cache';
import ProcessNode from './process-node';
import TextNode from './text-node';

export default class AssetPipeline {
  private asset_: Asset;

  constructor(asset: Asset) {
    this.asset_ = asset;
  }

  @Cache
  get processNode() {
    return new ProcessNode(this.asset_, this.textNode);
  }

  @Cache
  get textNode() {
    return new TextNode(this.asset_);
  }
}
