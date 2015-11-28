import Generator from './generator';

export default class {
  /**
   * @constructor
   * @param {Handlebars} HandlebarsService
   */
  constructor(HandlebarsService) {
    this.handlebarsService_ = HandlebarsService;
  }

  /**
   * Generates the HTML contents.
   * @method generate
   * @param {string} templateBody Template string used to generate the file contents.
   * @param {string} templateName Template used to generate the file names.
   * @param {Array} localDataList Array of objects containing the data for every file. This method
   *    will use every entry of this entry to generate a file.
   * @param {Object} [config] Configuration object. Defaults to {}. Supported values are:
   *    -   globals: Key value pair of global values. This will be applied to all files.
   *    -   helpers: Key value pair of Handlebar helpers. This will be applied to all files.
   *        The key should be the helper's name and the value is the helper's function.
   *    -   partials: Key value pair of Handlebar partials. This will be applied to all files.
   *        The key should be the partial's name, and the value is the partial's content.
   * @return {Object} Object with file name as the key and the file content as its value.
   */
  generate(templateBody, templateName, localDataList, options = {}) {
    let generator = new Generator(this.handlebarsService_, options);
    return generator.generate(templateBody, templateName, localDataList);
  }
};
