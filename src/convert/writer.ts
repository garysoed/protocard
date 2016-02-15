/**
 * @fileoverview Wrapper around a line data that executes a given transform function to the line
 * data.
 */
export default class Writer {
  private lineData_: string[][];

  /**
   * @param lineData Array of data. Each entry corresponds to a line.
   */
  constructor(lineData: string[][]) {
    this.lineData_ = lineData;
  }

  /**
   * Process the line data with the given function.
   * @param writerFn Function that takes in two prameters: data of a line and the line number, and
   *    returns the mapped value.
   * @return {Array} Array containing the output of the writer function. If the value is undefined,
   *    it will be removed from the array.
   */
  write<V>(writerFn: (data: string[], line: number) => V): V[] {
    return this.lineData_.map(writerFn).filter((item: V) => !!item);
  }
}
