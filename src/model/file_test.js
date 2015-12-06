import TestBase from '../testbase';

import File, { Types as FileTypes } from './file';

describe('data.File', () => {
  it('should be able to be converted to / from JSON', () => {
    let file = new File(FileTypes.TSV, 'content');
    let copy = File.fromJSON(file.toJSON());
    expect(copy).toEqual(file);
  });

  describe('getType', () => {
    it('should return the correct file type', () => {
      expect(File.getType('file.csv')).toEqual(FileTypes.CSV);
    });

    it('should return unknown as default case', () => {
      expect(File.getType('file.bro')).toEqual(FileTypes.UNKNOWN);
    });
  });
});
