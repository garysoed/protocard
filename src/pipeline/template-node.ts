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
import RequestTicket from '../util/request-ticket';
import RenderService from '../render/render-service';
import RenderedData from '../model/rendered-data';

export default class TemplateNode extends Node<{ [label: string]: RenderedData }> {
  private asset_: Asset;
  private generatorService_: GeneratorService;
  private renderService_: RenderService;
  private tickets_: RequestTicket<any>[];

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
    this.tickets_ = [];
  }

  runHandler_(dependencies): Promise<{ [label: string]: RenderedData }> {
    return new Promise((resolve, reject) => {
      let globals = <{ [key: string]: any }>dependencies[0];
      let helpers = <{ [key: string]: FunctionObject }>dependencies[1];
      let images = <{ [name: string]: ImageResource }>dependencies[2];
      // TODO(gs): Use labelledData instead of processed data
      let processedData = <any[]>dependencies[4];

      // Deactivate all tickets.
      this.tickets_.forEach(ticket => {
        ticket.deactivate();
      });
      this.tickets_ = [];

      try {
        let htmlStringMap = this.generatorService_
            .createGenerator(globals, helpers, images, this.asset_.partials)
            .generate(this.asset_.templateString, this.asset_.templateName, processedData);

        let result = {};
        for (let label in htmlStringMap) {
          let htmlString = htmlStringMap[label];
          let dataUriTicket = this.renderService_.render(
                htmlString,
                this.asset_.width,
                this.asset_.height);
          this.tickets_.push(dataUriTicket);
          result[label] = new RenderedData(dataUriTicket, htmlString);
        }
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  }
}
