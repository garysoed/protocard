import TestBase from '../testbase';
TestBase.init();

import Utils, { IDS } from './utils';

describe('util.Utils', () => {
  describe('generateKey', () => {
    it('should return the first number that is unique', () => {
      let obj = {
        'a': 1,
        'a_0': 2,
      };
      expect(Utils.generateKey(obj, 'a')).toEqual('a_1');
    });

    it('should return the prefix if the object is empty', () => {
      expect(Utils.generateKey({}, 'a')).toEqual('a');
    });
  });

  describe('getUniqueId', () => {
    afterEach(() => {
      for (let key in IDS) {
        delete IDS[key];
      }
    });

    it('should return a unique ID', () => {
      expect(Utils.getUniqueId('a')).toEqual('a');
      expect(Utils.getUniqueId('a')).toEqual('a_0');
      expect(Utils.getUniqueId('a')).toEqual('a_1');
    });
  });
});
