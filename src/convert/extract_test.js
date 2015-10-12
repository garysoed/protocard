import Extract from './extract';

describe('extract', () => {
  it('should return a write containing the lines split', () => {
    let lines = [
      ['1-1', '1-2'],
      ['2-1', '2-2']
    ];
    let content = lines.map(line => line.join('\t')).join('\n');
    let fn = jasmine.createSpy('fn');

    let writer = Extract.fromTsv(content);
    writer.write(fn);

    expect(fn).toHaveBeenCalledWith(lines[0], jasmine.any(Number), jasmine.any(Array));
    expect(fn).toHaveBeenCalledWith(lines[1], jasmine.any(Number), jasmine.any(Array));
  });

  it('should skip the given header lines', () => {
    let lines = [
      ['1-1', '1-2'],
      ['2-1', '2-2']
    ];
    let content = lines.map(line => line.join('\t')).join('\n');
    let fn = jasmine.createSpy('fn');

    let writer = Extract.fromTsv(content, 1);
    writer.write(fn);

    expect(fn).not.toHaveBeenCalledWith(lines[0], jasmine.any(Number), jasmine.any(Array));
    expect(fn).toHaveBeenCalledWith(lines[1], jasmine.any(Number), jasmine.any(Array));
  });
});
