import TestBase from '../testbase';

import Helper from './helper';

describe('data.Helper', () => {
  it('should be able to be converted to / from JSON', () => {
    let helper = new Helper();
    helper.fnString = 'fnString';

    let copy = Helper.fromJSON(helper.toJSON());
    expect(copy).toEqual(helper);
  });

  describe('asFunction', () => {
    it('should return the correct executable function', () => {
      let helper = new Helper();
      helper.fnString = 'return function(a) { return a + 1; };';

      let fn = helper.asFunction();
      expect(fn(3)).toEqual(4);
    });
  });
});
