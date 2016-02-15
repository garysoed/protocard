import Asset from '../model/asset';
import FunctionObject from '../model/function-object';
import GeneratorService from '../generate/generator-service';
import GlobalNode from './global-node';
import HelperNode from './helper-node';
import ImageNode from './image-node';
import ImageResource from '../model/image-resource';
import LabelNode from './label-node';
import Node from './node';

interface IPartialMap {
  [partialName: string]: { [label: string]: string };
};

export default class PartialNode extends Node<IPartialMap> {
  private asset_: Asset;
  private generatorService_: GeneratorService;

  constructor(
      asset: Asset,
      generatorService: GeneratorService,
      globalNode: GlobalNode,
      helperNode: HelperNode,
      imageNode: ImageNode,
      labelNode: LabelNode) {
    super([globalNode, helperNode, imageNode, labelNode]);
    this.asset_ = asset;
    this.generatorService_ = generatorService;
  }

  runHandler_(dependencies: any[]): Promise<IPartialMap> {
    return new Promise((resolve: (data: any) => void, reject: (data: any) => void) => {
      let globals = <{ [key: string]: any }>dependencies[0];
      let helpers = <{ [key: string]: FunctionObject }>dependencies[1];
      let images = <{ [name: string]: ImageResource }>dependencies[2];
      let labelledData = <{ data: { [label: string]: any }, index: Fuse }>dependencies[3];

      try {
        let results = {};
        let generator = this.generatorService_
            .createGenerator(globals, helpers, images, {} /* partials */);
        for (let partialName in this.asset_.partials) {
          let partialString = this.asset_.partials[partialName];
          results[partialName] = {};
          for (let label in labelledData.data) {
            results[partialName][label] =
                generator.generateSingle(partialString, labelledData.data[label]);
          }
        }

        resolve(results);
      } catch (e) {
        reject(e);
      }
    });
  }
};
