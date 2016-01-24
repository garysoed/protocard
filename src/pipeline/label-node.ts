import Node from './node';

import Asset from '../model/asset';
import FunctionObject from '../model/function-object';
import GeneratorService from '../generate/generator-service';
import GlobalNode from './global-node';
import HelperNode from './helper-node';
import ProcessNode from './process-node';

export default class LabelNode extends Node<{ [label: string]: any }> {
  private asset_: Asset;
  private generatorService_: GeneratorService;

  constructor(
      asset: Asset,
      generatorService: GeneratorService,
      globalNode: GlobalNode,
      helperNode: HelperNode,
      processNode: ProcessNode) {
    super([globalNode, helperNode, processNode]);
    this.asset_ = asset;
    this.generatorService_ = generatorService;
  }

  runHandler_(dependencies: any[]): Promise<{ [label: string]: any}> {
    return new Promise((resolve, reject) => {
      let globals = <{ [key: string]: any }>dependencies[0];
      let helpers = <{ [key: string]: FunctionObject }>dependencies[1];
      let processedData = <any[]>dependencies[2];

      try {
        resolve(this.generatorService_
            .createGenerator(globals, helpers, {} /* images */, {} /* partials */)
            .generateNames(this.asset_.templateName, processedData));
      } catch (e) {
        reject(e);
      }
    });
  }
}
