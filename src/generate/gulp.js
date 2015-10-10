import generate from './generate';

let through = require('through2');
let gutil = require('gulp-util');
let File = gutil.File;
let PluginError = gutil.PluginError;

/**
 * @method gulpGenerate
 * @param {string} outName Handlebar string used to generate the output file.
 * @param {Array} localDataList Array of objects containing the data for every file. This method
 *    will use every entry of this entry to generate a file.
 * @param {Object} [globals] Key value pair of global values. This will be applied to all files.
 * @param {Object} [helpers] Key value pair of Handlebar helpers. This will be applied to all files.
 *    The key should be the helper's name and the value is the helper's function.
 * @return {WriteableStream} The writeable stream object.
 */
function _gulpGenerate(generate, outName, localDataList, globals = {}, helpers = {}) {
  return through.obj(
      function(file, enc, cb) {
        let outFiles = generate(file, outName, localDataList, globals, helpers);
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
