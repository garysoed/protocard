import TestBase from '../testbase';

import File, { FileTypes } from './file';

describe('model.File', () => {
  describe('getType', () => {
    it('should return the correct file type', () => {
      expect(File.getType('file.csv')).toEqual(FileTypes.CSV);
    });

    it('should return unknown as default case', () => {
      expect(File.getType('file.bro')).toEqual(FileTypes.UNKNOWN);
    });
  });
});
