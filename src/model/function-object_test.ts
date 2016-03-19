import TestBase from '../testbase';
TestBase.init();

import FunctionObject from './function-object';
import Serializer from '../../node_modules/gs-tools/src/data/a-serializable';

describe('model.FunctionObject', () => {
  it('should be able to be converted to / from JSON', () => {
    let functionObject = new FunctionObject();
    functionObject.fnString = 'fnString';

    let copy = Serializer.fromJSON(Serializer.toJSON(functionObject));
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
