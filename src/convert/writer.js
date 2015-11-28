export default class {
  /**
   * @constructor
   * @method constructor
   * @param {Array} lineData Array of data. Each entry corresponds to a line.
   */
  constructor(lineData) {
    this.lineData_ = lineData;
  }

  /**
   * Process the line data with the given function.
   * @method write
   * @param {Function} writerFn Function that takes in two prameters: data of a line and the line
   *    number, and returns the mapped value.
   * @return {Array} Array containing the output of the writer function. If the value is undefined,
   *    it will be removed from the array.
   */
  write(writerFn) {
    return this.lineData_.map(writerFn).filter(item => !!item);
  }
}
