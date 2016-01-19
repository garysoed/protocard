import Asset from '../model/asset';
import Cache from '../decorators/cache';
import GeneratorService from '../generate/generator-service';
import GlobalNode from './global-node';
import HelperNode from './helper-node';
import ImageNode from './image-node';
import LabelNode from './label-node';
import ProcessNode from './process-node';
import TextNode from './text-node';

export default class AssetPipeline {
  private asset_: Asset;
  private generatorService_: GeneratorService;

  constructor(asset: Asset, generatorService: GeneratorService) {
    this.asset_ = asset;
    this.generatorService_ = generatorService;
  }

  @Cache
  get globalNode(): GlobalNode {
    return new GlobalNode(this.asset_);
  }

  @Cache
  get helperNode(): HelperNode {
    return new HelperNode(this.asset_);
  }

  @Cache
  get imageNode(): ImageNode {
    return new ImageNode(this.asset_);
  }

  @Cache
  get labelNode(): LabelNode {
    return new LabelNode(
        this.asset_,
        this.generatorService_,
        this.globalNode,
        this.helperNode,
        this.processNode);
  }

  @Cache
  get processNode(): ProcessNode {
    return new ProcessNode(this.asset_, this.textNode);
  }

  @Cache
  get textNode(): TextNode {
    return new TextNode(this.asset_);
  }
}
