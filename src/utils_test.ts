import Utils, { IDS } from './utils';

describe('Utils', () => {
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

    it('should throw error if keys conflict for non objects', () => {
      let dest = { a: 1 };
      let source = { a: 1 };
      expect(() => { Utils.mixin(source, dest); }).toThrowError(/Conflict at key/);
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

    it('should check equality for Set', () => {
      Array.from = (set) => {
        let output = [];
        for (let entry of set) {
          output.push(entry);
        }
        return output;
      };

      expect(Utils.equals(new Set([1, 2]), new Set([2, 1]))).toEqual(true);
    });
  });
});
