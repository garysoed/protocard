import Extract from '../convert/extract';
import Generator from './generator';
import { FileTypes } from '../model/file';
import Utils from '../utils';

// TODO(gs): Move to external file?
function imageUrlHelper(asset) {
  return function(name) {
    let url = null;
    return asset.images[name] ? asset.images[name].url : null;
  };
}

function lowercase(input) {
  return input
      .replace(/[^a-zA-Z0-9 ]/g, '_')
      .replace(/ /g, '-')
      .toLocaleLowerCase();
}

function ifeq(a, b, options) {
  if (a === b) {
    return options.fn(this);
  }
}

// TODO(gs): Refactor this.
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
        throw Error(`Unhandled file type: ${data.type}`);
    }

    return writer.write(asset.dataProcessor.asFunction());
  }

  newGenerator(asset) {
    let helpers = Utils.mapValue(asset.helpers, helper => helper.asFunction());
    helpers['_ifeq'] = ifeq;
    helpers['_imgUrl'] = imageUrlHelper(asset);
    helpers['_lowercase'] = lowercase;
    let options = {
      globals: asset.globals,
      helpers: helpers,
      partials: asset.partials
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
  generate(asset, localDataList, templateString, templateName) {
    // TODO(gs): Delete this.
    return this.newGenerator(asset)
        .generate(templateString, templateName, localDataList);
  }

  generateNames(asset) {
    return this.newGenerator(asset)
        .generateNames(asset.templateName, this.localDataList(asset));
  }
};
