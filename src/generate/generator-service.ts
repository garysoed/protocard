import Asset from '../model/asset';
import Extract from '../convert/extract';
import { FileTypes } from '../model/file';
import FunctionObject from '../model/function-object';
import Generator from './generator';
import ImageResource from '../model/image-resource';
import Utils from '../util/utils';
import Writer from '../convert/writer';

// TODO(gs): Move to external file?
function imageUrlHelper(images: { [key: string]: ImageResource }) {
  return function(name) {
    let url = null;
    return images[name] ? images[name].url : null;
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
  } else {
    return options.inverse(this);
  }
}

// TODO(gs): Refactor this.
export default class GeneratorService {
  private handlebarsService_: IHandlebars;

  /**
   * @param HandlebarsService
   */
  constructor(HandlebarsService: IHandlebars) {
    this.handlebarsService_ = HandlebarsService;
  }

  // TODO(gs): Test this.
  createGenerator(
      globals: { [key: string]: any },
      helpers: { [key: string]: FunctionObject },
      images: { [key: string]: ImageResource },
      partials: { [key: string]: string }) {

    let helperFns = Utils.mapValue(helpers, helper => helper.asFunction());
    helperFns['_ifeq'] = ifeq;
    helperFns['_imgUrl'] = imageUrlHelper(images);
    helperFns['_lowercase'] = lowercase;
    let options = {
      globals: globals,
      helpers: <{ [index: string]: Function }>helperFns,
      partials: partials
    };

    // TODO(gs): How to test this???
    return new Generator(this.handlebarsService_, options);
  }

  // TODO(gs): Delete anything below this.

  // TODO(gs): Delete this.
  localDataList(asset: Asset): any[] {
    let data = asset.data;
    let extracted;
    switch (data.type) {
      case FileTypes.TSV:
        extracted = Extract.fromTsv(data.content);
        break;
      default:
        throw Error(`Unhandled file type: ${data.type}`);
    }

    let writer = new Writer(extracted);
    return writer.write(<any>(asset.dataProcessor.asFunction()));
  }

  newGenerator(asset: Asset): Generator {
    return this.createGenerator(
        asset.globals,
        asset.helpers,
        asset.images,
        asset.partials);
  }

  /**
   * Generates the HTML contents.
   * @param asset The asset object to render.
   * @return Object with file name as the key and the file content as its value.
   */
  generate(
      asset: Asset,
      localDataList: any[],
      templateString: string,
      templateName: string): { [key: string]: string } {
    // TODO(gs): Delete this.
    return this.newGenerator(asset)
        .generate(templateString, templateName, localDataList);
  }
};
