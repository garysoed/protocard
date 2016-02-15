import Node from './node';

import Asset from '../model/asset';
import FunctionObject from '../model/function-object';
import GeneratorService from '../generate/generator-service';
import GlobalNode from './global-node';
import HelperNode from './helper-node';
import ProcessNode from './process-node';

export default class LabelNode extends Node<{ data: { [label: string]: any }, index: Fuse }> {
  private asset_: Asset;
  private fuseService_: FuseCtor;
  private generatorService_: GeneratorService;

  constructor(
      asset: Asset,
      fuseService: FuseCtor,
      generatorService: GeneratorService,
      globalNode: GlobalNode,
      helperNode: HelperNode,
      processNode: ProcessNode) {
    super([globalNode, helperNode, processNode]);
    this.asset_ = asset;
    this.fuseService_ = fuseService;
    this.generatorService_ = generatorService;
  }

  runHandler_(dependencies: any[]): Promise<{ data: { [label: string]: any }, index: Fuse }> {
    return new Promise((resolve: (data: any) => void, reject: (data: any) => void) => {
      let globals = <{ [key: string]: any }> dependencies[0];
      let helpers = <{ [key: string]: FunctionObject }> dependencies[1];
      let processedData = <any[]> dependencies[2];

      try {
        let data = this.generatorService_
            .createGenerator(globals, helpers, {} /* images */, {} /* partials */)
            .generateNames(this.asset_.templateName, processedData);

        let labels = [];
        for (let label in data) {
          labels.push({ label: label });
        }

        resolve({
          data: data,
          index: new (this.fuseService_)(labels, { keys: ['label'] }),
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
