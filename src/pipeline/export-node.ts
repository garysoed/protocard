import ImageResource from '../model/image-resource';
import Node from './node';
import RenderedData from '../model/rendered-data';
import TemplateNode from './template-node';

export default class ExportNode extends Node<Promise<ImageResource>[]> {
  constructor(templateNode: TemplateNode) {
    super([templateNode]);
  }

  runHandler_(dependencies: any[]): Promise<Promise<ImageResource>[]> {
    return new Promise((resolve, reject) => {
      let renderedDataMap: { [label: string]: RenderedData } = dependencies[0];
      let imageResourcePromises = [];
      for (let label in renderedDataMap) {
        imageResourcePromises.push(renderedDataMap[label].dataUriTicket.promise
            .then(function(label, dataUri) {
              return new ImageResource(label, dataUri);
            }.bind(null, label)));
      }
      resolve(imageResourcePromises);
    });
  }
}
