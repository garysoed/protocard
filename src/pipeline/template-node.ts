import Asset from '../model/asset';
import FunctionObject from '../model/function-object';
import GeneratorService from '../generate/generator-service';
import GlobalNode from './global-node';
import HelperNode from './helper-node';
import ImageNode from './image-node';
import ImageResource from '../model/image-resource';
import LabelNode from './label-node';
import Node from './node';
import PartialNode from './partial-node';
import ProcessNode from './process-node';
import RenderService from '../render/render-service';
import RenderedData from '../model/rendered-data';

export default class TemplateNode extends Node<{ [label: string]: RenderedData }> {
  private asset_: Asset;
  private generatorService_: GeneratorService;
  private renderService_: RenderService;

  constructor(
      asset: Asset,
      generatorService: GeneratorService,
      globalNode: GlobalNode,
      helperNode: HelperNode,
      imageNode: ImageNode,
      labelNode: LabelNode,
      partialNode: PartialNode,
      processNode: ProcessNode,
      renderService: RenderService) {
    super([globalNode, helperNode, imageNode, labelNode, processNode, partialNode]);
    this.asset_ = asset;
    this.generatorService_ = generatorService;
    this.renderService_ = renderService;
  }

  runHandler_(dependencies): Promise<{ [label: string]: RenderedData }> {
    return new Promise((resolve, reject) => {
      let globals = <{ [key: string]: any }>dependencies[0];
      let helpers = <{ [key: string]: FunctionObject }>dependencies[1];
      let images = <{ [name: string]: ImageResource }>dependencies[2];
      let labelledData = <{ [key: string]: any }>dependencies[3];
      let processedData = <any[]>dependencies[4];

      try {
        let htmlStringMap = this.generatorService_
            .createGenerator(globals, helpers, images, this.asset_.partials)
            .generate(this.asset_.templateString, this.asset_.templateName, processedData);

        let result = {};
        for (let label in htmlStringMap) {
          let htmlString = htmlStringMap[label];
          // TODO(gs): Read the size from the asset.
          // let dataUriTicket = this.renderService_.render(htmlString, 825, 1125);
          let dataUriTicket = null;
          result[label] = new RenderedData(dataUriTicket, htmlString);
        }
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  }
}
