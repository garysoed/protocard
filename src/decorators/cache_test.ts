import TestBase from '../testbase';
TestBase.init();

import Cache from './cache';

describe('decorators.Cache', () => {
  class TestClass {
    spy_: jasmine.Spy;

    constructor(spy: jasmine.Spy) {
      this.spy_ = spy;
    }

    @Cache
    get property() {
      return this.spy_();
    }
  }

  let test;
  let spy;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');
    test = new TestClass(spy);
  });

  it('should cache the getter', () => {
    let value = 'value';
    spy.and.returnValue(value);

    expect(test.property).toEqual(value);

    spy.calls.reset();
    expect(test.property).toEqual(value);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should throw error on non getter properties', () => {
    let descriptor = <TypedPropertyDescriptor<any>>{};
    expect(() => {
      Cache({}, 'property', descriptor);
    }).toThrowError(/needs to be a getter/);
  });

  describe('clear', () => {
    it('should clear the cache', () => {
      let value = 'value';
      spy.and.returnValue(value);

      expect(test.property).toEqual(value);

      spy.calls.reset();
      Cache.clear(test);
      expect(test.property).toEqual(value);
      expect(spy).toHaveBeenCalledWith();
    });
  });
});
