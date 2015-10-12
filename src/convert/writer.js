const __lineData__ = Symbol('lineData');

class Writer {
  constructor(lineData) {
    this[__lineData__] = lineData;
  }

  write(writerFn) {
    return this[__lineData__].map(writerFn);
  }
}

export default Writer;
