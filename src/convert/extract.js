import Writer from './writer';

export default {
  fromTsv(content, headerLineCount = 0) {
    let lines = content.split('\n');
    lines.splice(0, headerLineCount);

    let lineData = lines.map(line => {
      return line.split('\t');
    });

    return new Writer(lineData);
  }
};
