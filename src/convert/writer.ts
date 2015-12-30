export default class Writer<T> {
  private lineData_: T[];

  /**
   * @param lineData Array of data. Each entry corresponds to a line.
   */
  constructor(lineData: T[]) {
    this.lineData_ = lineData;
  }

  /**
   * Process the line data with the given function.
   * @param writerFn Function that takes in two prameters: data of a line and the line number, and
   *    returns the mapped value.
   * @return {Array} Array containing the output of the writer function. If the value is undefined,
   *    it will be removed from the array.
   */
  write<V>(writerFn: (data: T, line: number) => V): V[] {
    return this.lineData_.map(writerFn).filter(item => !!item);
  }
}
