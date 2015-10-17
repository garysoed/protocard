import { default as Generator } from './generator';

let File = require('gulp-util').File;
let through = require('through2');

const __generator__ = Symbol('generator');

class GeneratorGulp {
  /**
   * @constructor
   * @param {Object} [config] Configuration object. Defaults to {}. Supported values are:
   *    -   globals: Key value pair of global values. This will be applied to all files.
   *    -   helpers: Key value pair of Handlebar helpers. This will be applied to all files.
   *        The key should be the helper's name and the value is the helper's function.
   *    -   partials: Key value pair of Handlebar partials. This will be applied to all files.
   *        The key should be the partial's name, and the value is the partial's content.
   */
  constructor(config, generator = new Generator(config)) {
    this[__generator__] = generator;
  }

  /**
   * Generates files using the given template as input stream, and data.
   *
   * @method generate
   * @param {string} templateName Template used to generate the file names.
   * @param {Array} localDataList Array of objects containing the data for every file. This method
   *    will use every entry of this entry to generate a file.
   * @return {*} The through object.
   */
  generate(templateName, localDataList) {
    let generator = this[__generator__];
    return through.obj(
        function(file, encoding, callback) {
          let outFiles = generator.generate(file.contents.toString(), templateName, localDataList);
          for (let filename in outFiles) {
            this.push(new File({
              path: filename,
              contents: new Buffer(outFiles[filename])
            }));
          }
          callback();
        });
  }

  /**
   * Resolves the files coming from input stream.
   *
   * @method resolve
   */
  resolve() {
    let generator = this[__generator__];
    return through.obj(
        function(file, encoding, callback) {
          this.push(new File({
            path: file.path,
            contents: new Buffer(generator.resolve(file.contents.toString()))
          }));
          callback();
        });
  }
}

export default GeneratorGulp;
