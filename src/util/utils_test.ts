import TestBase from '../testbase';
TestBase.init();

import Utils, { IDS } from './utils';

describe('util.Utils', () => {
  describe('generateKey', () => {
    it('should return the first number that is unique', () => {
      let obj = {
        'a': 1,
        'a_0': 2
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

  describe('mixin', () => {
    it('should copy the source keys to the destination object', () => {
      let dest = { a: 1 };
      let source = { b: 2, c: 3 };
      Utils.mixin(source, dest);

      expect(dest).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should recursively mixin the values', () => {
      let dest = { a: { ab: 1 } };
      let source = { a: { cd: 2 } };
      Utils.mixin(source, dest);
      expect(dest).toEqual({
        a: {
          ab: 1,
          cd: 2
        }
      });
    });

    it('should ignore if keys conflict for non objects', () => {
      let dest = { a: 2 };
      let source = { a: 1 };
      Utils.mixin(source, dest);
      expect(dest.a).toEqual(2);
    });
  });

  describe('mapValue', () => {
    it('should map the values of the given array', () => {
      let obj = jasmine.cast<{ [index: string]: string }>({
        a: 'a',
        b: 'b'
      });
      let out = Utils.mapValue(obj, value => `${value}_`);
      expect(out).toEqual({ a: 'a_', b: 'b_' });
    });
  });
});
