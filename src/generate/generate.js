import Utils from '../utils';

let fs = require('fs');
let handlebars = require('handlebars');
let path = require('path');

function _resolve(handlebars, data, deps) {
  let resolvedData = {};
  for (let key in data) {
    let value = data[key];
    if (typeof value === 'object') {
      resolvedData[key] = _resolve(handlebars, value, deps);
    } else if (typeof value === 'string') {
      resolvedData[key] = handlebars.compile(value)(deps);
    } else {
      resolvedData[key] = value;
    }
  }
  return resolvedData;
}

function _generate(
    fs,
    handlebars,
    path,
    templatePath,
    outName,
    localDataList,
    globals = {},
    helpers = {}) {
  // Register the helpers.
  for (let key in helpers) {
    handlebars.registerHelper(key, helpers[key]);
  }

  let template = handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
  let outNameTemplate = handlebars.compile(outName);

  let outContent = {};

  // Generates all the local data.
  localDataList.forEach(function(localData) {
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
    Utils.mixin({_local: evalLocalData}, data);
    let rendered = template(data);
    let outName = outNameTemplate(data);
    outContent[outName] = rendered;
  });

  return outContent;
}

export { _generate as _provider };

/**
 * Generates the files using the given data.
 *
 * @method generate
 * @param {string} templatePath Path to the template to generate the files.
 * @param {string} outDir Path to directory to contain the generated files.
 * @param {string} outName Handlebars string to generate the filename.
 * @param {Array} localDataList Array of objects containing the data for every file. This method
 *    will use every entry of this entry to generate a file.
 * @param {Object} [globals] Key value pair of global values. This will be applied to all files.
 * @param {Object} [helpers] Key value pair of Handlebar helpers. This will be applied to all files.
 *    The key should be the helper's name and the value is the helper's function.
 */
export default _generate.bind(null, fs, handlebars, path);
