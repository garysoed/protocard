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
    get property(): any {
      return this.spy_();
    }

    @Cache
    method(): void {
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

  it('should cache the method', () => {
    let value = 'value';
    spy.and.returnValue(value);

    expect(test.method()).toEqual(value);

    spy.calls.reset();
    expect(test.method()).toEqual(value);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should throw error on non getter properties', () => {
    let descriptor = <TypedPropertyDescriptor<any>> {};
    expect(() => {
      Cache({}, 'property', descriptor);
    }).toThrowError(/has to be a getter or a function/);
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
