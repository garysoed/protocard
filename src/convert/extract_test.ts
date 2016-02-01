import Extract from './extract';

describe('extract', () => {
  it('should return a write containing the lines split', () => {
    let lines = [
      ['1-1', '1-2'],
      ['2-1', '2-2']
    ];

    let content = lines.map(line => line.join('\t')).join('\r\n');
    expect(Extract.fromTsv(content)).toEqual(lines);
  });
});
