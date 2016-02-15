import Writer from './writer';

describe('Writer', () => {
  it('should call the writer function and return the mapped values', () => {
    let input = [
      ['line', '1'],
      ['line', '2'],
    ];

    let writer = new Writer(input);
    let result = writer.write((data: any[]) => data[0] + data[1]);
    expect(result).toEqual(['line1', 'line2']);
  });

  it('should remove undefined values', () => {
    let input = [['included'], ['excluded']];

    let writer = new Writer(input);
    let result = writer.write((data: any, index: number) => index === 0 ? data : undefined);
    expect(result).toEqual([['included']]);
  });
});
