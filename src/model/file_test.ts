import TestBase from '../testbase';

import File, { FileTypes } from './file';
import Serializable from './serializable';

describe('model.File', () => {
  it('should be able to be converted to / from JSON', () => {
    let file = new File(FileTypes.TSV, 'content');
    let copy = Serializable.fromJSON(Serializable.toJSON(file));
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
