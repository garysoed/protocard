import Utils from '../utils';

const __globals__ = Symbol('globals');
const __handlebars__ = Symbol('handlebars');
const __resolve__ = Symbol('resolve');

/**
 * Generator logic.
 *
 * @class Generator
 */
export default class {

  /**
   * @constructor
   * @param {*} handlebars Reference to Handlebars
   * @param {Object} [config] Configuration object. Defaults to {}. Supported values are:
   *    -   globals: Key value pair of global values. This will be applied to all files.
   *    -   helpers: Key value pair of Handlebar helpers. This will be applied to all files.
   *        The key should be the helper's name and the value is the helper's function.
   *    -   partials: Key value pair of Handlebar partials. This will be applied to all files.
   *        The key should be the partial's name, and the value is the partial's content.
   */
  constructor(handlebars, config = {}) {
    let globals = config.globals || {};
    let helpers = config.helpers || {};
    let partials = config.partials || {};

    this[__globals__] = globals;
    var data = {
      _pc: {
        size: {
          height: '1125px',
          width: '825px'
        }
      }
    };
    Utils.mixin(data, this[__globals__]);

    this[__handlebars__] = handlebars;

    // Register the helpers.
    for (let key in helpers) {
      handlebars.registerHelper(key, helpers[key]);
    }

    // Register the partials.
    for (let key in partials) {
      handlebars.registerPartial(key, partials[key]);
    }
  }

  [__resolve__](data, deps, options) {
    let resolvedData = {};
    for (let key in data) {
      let value = data[key];
      if (typeof value === 'object') {
        resolvedData[key] = this[__resolve__](value, deps, options);
      } else if (typeof value === 'string') {
        resolvedData[key] = this[__handlebars__].compile(value, options)(deps);
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
   * @param {string} templateBody Template string used to generate the file contents.
   * @param {string} templateName Template used to generate the file names.
   * @param {Array} localDataList Array of objects containing the data for every file. This method
   *    will use every entry of this entry to generate a file.
   * @return {Object} Object with file name as the key and the file content as its value.
   */
  generate(templateBody, templateName, localDataList) {
    // TODO(gs): Expose this
    let options = {
      noEscape: true
    };

    let template = this[__handlebars__].compile(templateBody, options);
    let outNameTemplate = this[__handlebars__].compile(templateName, options);

    let outContent = {};

    // Generates all the local data.
    localDataList.forEach(localData => {
      try {
        let evalLocalData = this[__resolve__](localData, this[__globals__]);
        let data = JSON.parse(JSON.stringify(this[__globals__]));
        Utils.mixin({ _: evalLocalData }, data);
        let rendered = template(data);
        let outName = outNameTemplate(data);
        outContent[outName] = rendered;
      } catch (e) {
        // TODO(gs): Clarify the causal chain.
        throw Error([
            'Error while trying to generate local data:',
            JSON.stringify(localData, 2),
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
    return this[__handlebars__].compile(templateString)(this[__globals__]);
  }
};
