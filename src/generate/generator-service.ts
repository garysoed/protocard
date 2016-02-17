import FunctionObject from '../model/function-object';
import Generator from './generator';
import ImageResource from '../model/image-resource';
import Records from '../../node_modules/gs-tools/src/collection/records';

// TODO(gs): Move to external file?
function imageUrlHelper(images: { [key: string]: ImageResource }): Function {
  return function(name: string): string {
    return images[name] ? images[name].url : null;
  };
}

function lowercase(input: string): string {
  return input
      .replace(/[^a-zA-Z0-9 ]/g, '_')
      .replace(/ /g, '-')
      .toLocaleLowerCase();
}

function ifeq(a: any, b: any, options: Handlebars.IHelperOptions): string {
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
      partials: { [key: string]: string }): Generator {
    let helperFns = Records.mapValue(helpers, (helper: FunctionObject) => helper.asFunction());
    helperFns['_ifeq'] = ifeq;
    helperFns['_imgUrl'] = imageUrlHelper(images);
    helperFns['_lowercase'] = lowercase;
    let options = {
      globals: globals,
      helpers: <{ [index: string]: Function }> helperFns,
      partials: partials,
    };
    return new Generator(this.handlebarsService_, options);
  }
};
