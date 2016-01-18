import Asset from '../model/asset';
import Extract from '../convert/extract';
import { FileTypes } from '../model/file';
import Generator from './generator';
import Utils from '../utils';
import Writer from '../convert/writer';

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
    let helpers = Utils.mapValue(asset.helpers, helper => helper.asFunction());
    helpers['_ifeq'] = ifeq;
    helpers['_imgUrl'] = imageUrlHelper(asset);
    helpers['_lowercase'] = lowercase;
    let options = {
      globals: asset.globals,
      helpers: <{ [index: string]: Function }>helpers,
      partials: asset.partials
    };

    // TODO(gs): How to test this???
    return new Generator(this.handlebarsService_, options);
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

  generateNames(asset: Asset): { [key: string]: any } {
    return this.newGenerator(asset)
        .generateNames(asset.templateName, this.localDataList(asset));
  }
};
