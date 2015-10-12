import Utils from '../utils';

let handlebars = require('handlebars');
let path = require('path');

function _resolve(handlebars, data, deps, options) {
  let resolvedData = {};
  for (let key in data) {
    let value = data[key];
    if (typeof value === 'object') {
      resolvedData[key] = _resolve(handlebars, value, deps, options);
    } else if (typeof value === 'string') {
      resolvedData[key] = handlebars.compile(value, options)(deps);
    } else {
      resolvedData[key] = value;
    }
  }
  return resolvedData;
}

function _generate(
    handlebars,
    path,
    templateFile,
    outName,
    localDataList,
    config = {}) {
  let globals = config.globals || {};
  let helpers = config.helpers || {};
  let partials = config.partials || {};

  // TODO(gs): Expose this
  let options = {
    noEscape: true
  };

  // Register the helpers.
  for (let key in helpers) {
    handlebars.registerHelper(key, helpers[key]);
  }

  // Register the partials.
  for (let key in partials) {
    handlebars.registerPartial(key, partials[key]);
  }

  let template = handlebars.compile(templateFile.contents.toString(), options);
  let outNameTemplate = handlebars.compile(outName, options);

  let outContent = {};

  // Generates all the local data.
  localDataList.forEach(function(localData) {
    try {
      var data = {
        _pc: {
          size: {
            height: '1125px',
            width: '825px'
          }
        }
      };
      Utils.mixin(globals, data);

      let evalLocalData = _resolve(handlebars, localData, data);
      Utils.mixin({_: evalLocalData}, data);
      let rendered = template(data);
      let outName = outNameTemplate(data);
      outContent[outName] = rendered;
    } catch (e) {
      throw Error('Error while trying to generate local data:\n' + JSON.stringify(localData, 2)
          + '\n' + e);
    }
  });

  return outContent;
}

export { _generate as _provider };

/**
 * Generates the files using the given data.
 *
 * @method generate
 * @param {File} templateFile File containing the template.
 * @param {string} outDir Path to directory to contain the generated files.
 * @param {string} outName Handlebars string to generate the filename.
 * @param {Array} localDataList Array of objects containing the data for every file. This method
 *    will use every entry of this entry to generate a file.
 * @param {Object} [config] Configuration object. Defaults to {}. Supported values are:
 *    -   globals: Key value pair of global values. This will be applied to all files.
 *    -   helpers: Key value pair of Handlebar helpers. This will be applied to all files.
 *        The key should be the helper's name and the value is the helper's function.
 *    -   partials: Key value pair of Handlebar partials. This will be applied to all files.
 *        The key should be the partial's name, and the value is the partial's content.
 */
export default _generate.bind(null, handlebars, path);
