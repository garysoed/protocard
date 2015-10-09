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

// TODO(gs): Gulpify this.
function _generate(
    fs,
    handlebars,
    path,
    templatePath,
    outDir,
    outName,
    localDataList,
    globals = {},
    helpers = {},
    assetsDir = null) {
  // Register the helpers.
  for (let key in helpers) {
    handlebars.registerHelper(key, helpers[key]);
  }

  let template = handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
  let outNameTemplate = handlebars.compile(outName);

  // Make the output directory if it doesn't exist.
  try {
    fs.statSync(outDir);
  } catch (e) {
    fs.mkdirSync(outDir);
  }

  // Generates all the cards.
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
    var rendered = template(data);
    var outName = outNameTemplate(data);
    fs.writeFileSync(path.join(outDir, outName), rendered);
  });

  // Copies all the assets.
  // TODO(gs): Enable handlebar support in asset files.
  if (assetsDir) {
    var assetsName = path.basename(assetsDir);
    var destAssets = path.join(outDir, assetsName)

    // Deletes the link if it exists.
    try {
      fs.statSync(destAssets);
      fs.unlink(destAssets);
    } catch (e) { }

    // Generates the symlink.
    fs.linkSync(assetsDir, destAssets);
  }
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
 * @param {string} [assetsDir] If specified, this method will copy the assets directory to the
 *    output directory.
 */
export default _generate.bind(null, fs, handlebars, path);
