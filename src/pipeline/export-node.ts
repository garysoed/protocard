import ImageResource from '../model/image-resource';
import Node from './node';
import RenderedData from '../model/rendered-data';
import TemplateNode from './template-node';

export default class ExportNode extends Node<Promise<ImageResource>[]> {
  constructor(templateNode: TemplateNode) {
    super([templateNode]);
  }

  runHandler_(dependencies: any[]): Promise<Promise<ImageResource>[]> {
    return new Promise((resolve: (data: any) => void, reject: (data: any) => void) => {
      let renderedDataMap: { [label: string]: RenderedData } = dependencies[0];
      let imageResourcePromises = [];
      for (let label in renderedDataMap) {
        imageResourcePromises.push(renderedDataMap[label].dataUriTicket
            .promise
            .then(function(label: string, dataUri: string): ImageResource {
              return new ImageResource(label, dataUri);
            }.bind(null, label)));
      }
      resolve(imageResourcePromises);
    });
  }
}
