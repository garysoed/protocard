import generate from './generate';

let through = require('through2');
let gutil = require('gulp-util');
let File = gutil.File;
let PluginError = gutil.PluginError;

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
function _gulpGenerate(generate, outName, localDataList, config = {}) {
  return through.obj(
      function(file, enc, cb) {
        let outFiles = generate(file, outName, localDataList, config);
        for (let filename in outFiles) {
          this.push(new File({
            path: filename,
            contents: new Buffer(outFiles[filename])
          }));
        }
        cb();
      });
};

export { _gulpGenerate as _provider };
export default _gulpGenerate.bind(null, generate);
