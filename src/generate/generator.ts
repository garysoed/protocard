import Utils from '../utils';

interface Config {
  globals?: { [key: string]: any };
  helpers?: { [key: string]: Function };
  partials?: { [key: string]: string };
}

/**
 * Generator logic.
 */
export default class Generator {

  private globals_: { [key: string]: string };
  private handlebars_: IHandlebars;

  /**
   * @constructor
   * @param handlebars Reference to Handlebars
   * @param [config] Configuration object. Defaults to {}.
   */
  constructor(handlebars: IHandlebars, config: Config = {}) {
    let globals = config.globals || {};
    let helpers = config.helpers || {};
    let partials = config.partials || {};

    this.globals_ = {};
    var data = {
      _pc: {
        size: {
          height: '1125px',
          width: '825px'
        }
      }
    };
    Utils.mixin(data, this.globals_);
    Utils.mixin(globals, this.globals_);

    this.handlebars_ = handlebars;

    // Register the helpers.
    for (let key in helpers) {
      handlebars.registerHelper(key, helpers[key]);
    }

    // Register the partials.
    for (let key in partials) {
      handlebars.registerPartial(key, partials[key]);
    }
  }

  private resolve_(
      data: { [key: string]: any },
      deps: any,
      options: any): { [key: string]: any } {
    let resolvedData = <{ [key: string]: any }>{};
    for (let key in data) {
      let value = data[key];
      if (typeof value === 'object') {
        resolvedData[key] = this.resolve_(value, deps, options);
      } else if (typeof value === 'string') {
        resolvedData[key] = this.handlebars_.compile(value, options)(deps);
      } else {
        resolvedData[key] = value;
      }
    }
    return resolvedData;
  }

  /**
   * Generates files using the given template and data.
   *
   * @method generate
   * @param templateBody Template string used to generate the file contents.
   * @param templateName Template used to generate the file names.
   * @param localDataList Array of objects containing the data for every file. This method
   *    will use every entry of this entry to generate a file.
   * @return Object with file name as the key and the file content as its value.
   */
  generate(
      templateBody: string,
      templateName: string,
      localDataList: any[]): { [name: string]: string } {
    // TODO(gs): Expose this
    let options = {
      noEscape: true
    };

    let template = this.handlebars_.compile(templateBody, options);
    let outNameTemplate = this.handlebars_.compile(templateName, options);

    let outContent = <{ [name: string]: string }>{};

    // Generates all the local data.
    localDataList.forEach(localData => {
      try {
        let evalLocalData = this.resolve_(localData, this.globals_, options);
        let data = JSON.parse(JSON.stringify(this.globals_));
        Utils.mixin({ _: evalLocalData }, data);
        let rendered = template(data);
        let outName = outNameTemplate(data);
        outContent[outName] = rendered;
      } catch (e) {
        // TODO(gs): Clarify the causal chain.
        throw Error([
            'Error while trying to generate local data:',
            JSON.stringify(localData, null, 2),
            e].join('\n'));
      }
    });

    return outContent;
  }

  // TODO(gs): Generic the local data type.
  generateNames(templateName: string, localDataList: any[]): { [key: string]: any } {
    // TODO(gs): Combine with generate
    // TODO(gs): Expose this
    let options = {
      noEscape: true
    };

    let outNameTemplate = this.handlebars_.compile(templateName, options);

    let outContent = {};

    // Generates all the local data.
    localDataList.forEach(localData => {
      try {
        let evalLocalData = this.resolve_(localData, this.globals_, options);
        let data = JSON.parse(JSON.stringify(this.globals_));
        Utils.mixin({ _: evalLocalData }, data);
        let outName = outNameTemplate(data);
        outContent[outName] = localData;
      } catch (e) {
        // TODO(gs): Clarify the causal chain.
        throw Error([
            'Error while trying to generate local data:',
            JSON.stringify(localData, null, 2),
            e].join('\n'));
      }
    });

    return outContent;
  }

  /**
   * Resolves the given template string using global data.
   *
   * @method resolve
   * @param {string} templateString Template string to be resolved.
   * @return {string} String based on the resolved template string.
   */
  resolve(templateString) {
    return this.handlebars_.compile(templateString)(this.globals_);
  }
};
