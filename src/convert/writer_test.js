import Writer from './writer';

describe('Writer', () => {
  it('should call the writer function and return the mapped values', () => {
    let input = [
      ['line', '1'],
      ['line', '2']
    ];

    let writer = new Writer(input);
    expect(writer.write(data => data[0] + data[1])).toEqual(['line1', 'line2']);
  });
});
