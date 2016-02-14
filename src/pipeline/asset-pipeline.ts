import Asset from '../model/asset';
import Cache from '../decorator/cache';
import ExportNode from './export-node';
import GeneratorService from '../generate/generator-service';
import GlobalNode from './global-node';
import HelperNode from './helper-node';
import ImageNode from './image-node';
import LabelNode from './label-node';
import PartialNode from './partial-node';
import ProcessNode from './process-node';
import RenderService from '../render/render-service';
import TemplateNode from './template-node';
import TextNode from './text-node';

export default class AssetPipeline {
  private asset_: Asset;
  private fuseService_: FuseCtor;
  private generatorService_: GeneratorService;
  private renderService_: RenderService;

  constructor(
      asset: Asset,
      fuseService: FuseCtor,
      generatorService: GeneratorService,
      renderService: RenderService) {
    this.asset_ = asset;
    this.fuseService_ = fuseService;
    this.generatorService_ = generatorService;
    this.renderService_ = renderService;
  }

  @Cache
  get exportNode(): ExportNode {
    return new ExportNode(this.templateNode);
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
        this.fuseService_,
        this.generatorService_,
        this.globalNode,
        this.helperNode,
        this.processNode);
  }

  @Cache
  get partialNode(): PartialNode {
    return new PartialNode(
        this.asset_,
        this.generatorService_,
        this.globalNode,
        this.helperNode,
        this.imageNode,
        this.labelNode);
  }

  @Cache
  get processNode(): ProcessNode {
    return new ProcessNode(this.asset_, this.textNode);
  }

  @Cache
  get templateNode(): TemplateNode {
    return new TemplateNode(
        this.asset_,
        this.generatorService_,
        this.globalNode,
        this.helperNode,
        this.imageNode,
        this.labelNode,
        this.partialNode,
        this.processNode,
        this.renderService_);
  }

  @Cache
  get textNode(): TextNode {
    return new TextNode(this.asset_);
  }
}
