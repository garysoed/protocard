import Writer from './writer';

export default {
  fromTsv(content: string, headerLineCount = 0): Writer<string[]> {
    let lines = content.split('\n');
    lines.splice(0, headerLineCount);

    let lineData = lines.map(line => {
      return line.split('\t');
    });

    return new Writer<string[]>(lineData);
  }
};
