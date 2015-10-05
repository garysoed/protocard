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
});
