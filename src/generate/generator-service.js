import Extract from '../convert/extract';
import Generator from './generator';
import { Types as FileTypes } from '../data/file';
import Utils from '../utils';

// TODO(gs): Move to external file?
function imageUrlHelper(asset) {
  return function(name) {
    let url = null;
    asset.images.forEach(image => {
      if (image.alias === name) {
        url = image.url;
      }
    });
    return url;
  };
}

export default class {
  /**
   * @constructor
   * @param {Handlebars} HandlebarsService
   */
  constructor(HandlebarsService) {
    this.handlebarsService_ = HandlebarsService;
  }

  localDataList(asset) {
    let data = asset.data;
    let writer;
    switch (data.type) {
      case FileTypes.TSV:
        writer = Extract.fromTsv(data.content);
        break;
      default:
        throw Error(`Unhandled file type: ${dataFile.type}`);
    }

    return writer.write(asset.dataProcessor.asFunction());
  }

  newGenerator(asset) {
    let helpers = Utils.mapValue(asset.helpers, helper => helper.asFunction());
    helpers['_imgUrl'] = imageUrlHelper(asset);
    let options = {
      globals: asset.globals,
      helpers: helpers,
      partials: {}
    };

    // TODO(gs): How to test this???
    return new Generator(this.handlebarsService_, options);
  }

  /**
   * Generates the HTML contents.
   * @method generate
   * @param {data.Asset} asset The asset object to render.
   * @return {Object} Object with file name as the key and the file content as its value.
   */
  generate(asset, localDataList) {
    return this.newGenerator(asset)
        .generate(asset.templateString, asset.templateName, localDataList);
  }
};
