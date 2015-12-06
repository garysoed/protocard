export default class {
  constructor(rawData, format) {
    this.rawData = rawData;
    this.format = format;
  }

  toJSON() {
    return {
      rawData: this.rawData,
      format: this.format
    };
  }

  static fromJSON(json) {
    return json ? new this(json['rawData'], json['format']) : null;
  }

  static equals(a, b) {
    if (a === b) {
      return true;
    }

    if (a instanceof this && b instanceof this) {
      return a.rawData === b.rawData
          && a.format === b.format
    }
  }
};
