require('babel/polyfill');

import Utils from './utils';

describe('Utils', () => {
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

    it('should throw error if keys conflict for non objects', () => {
      let dest = { a: 1 };
      let source = { a: 1 };
      expect(() => { Utils.mixin(source, dest); }).toThrowError(/Conflict at key/);
    });
  });

  describe('mapValue', () => {
    it('should map the values of the given array', () => {
      let obj = {
        a: 'a',
        b: 'b'
      };
      let out = Utils.mapValue(obj, value => `${value}_`);
      expect(out).toEqual({ a: 'a_', b: 'b_' });
    });
  });

  describe('equals', () => {
    it('should check equality for primitives', () => {
      expect(Utils.equals(1, 1)).toEqual(true);
    });

    it('should check equality for objects', () => {
      expect(Utils.equals({ a: { b: 2 } }, { a: { b: 2 } })).toEqual(true);
    });

    it('should use the equalsFn to check for equality', () => {
      expect(Utils.equals({ a: 1 }, 1, () => true)).toEqual(true);
    });

    it('should use the equalsFn to check for equality for objects', () => {
      expect(Utils.equals({ a: 1 }, { a: 2 }, () => true)).toEqual(true);
    });
  });
});
