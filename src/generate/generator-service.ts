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
    return new Generator(this.handlebarsService_, options);
  }
};
