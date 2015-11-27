import TestBase from '../testbase';

import FunctionObject from './function-object';

describe('data.FunctionObject', () => {
  it('should be able to be converted to / from JSON', () => {
    let functionObject = new FunctionObject();
    functionObject.fnString = 'fnString';

    let copy = FunctionObject.fromJSON(functionObject.toJSON());
    expect(copy).toEqual(functionObject);
  });

  describe('asFunction', () => {
    it('should return the correct executable function', () => {
      let functionObject = new FunctionObject();
      functionObject.fnString = 'return function(a) { return a + 1; };';

      let fn = functionObject.asFunction();
      expect(fn(3)).toEqual(4);
    });
  });
});
