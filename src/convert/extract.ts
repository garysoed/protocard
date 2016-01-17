/**
 * @fileoverview Extracts spreadsheet data, from various formats to a string[][] object. The first
 * dimension is the row, while the second dimension is the column.
 */
export default {
  fromTsv(content: string): string[][] {
    let lines = content.split('\n');
    let lineData = lines.map(line => {
      return line.split('\t');
    });

    return lineData;
  }
};
