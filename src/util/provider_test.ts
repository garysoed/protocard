import TestBase from '../testbase';
TestBase.init();

import Provider from './provider';

describe('util.Provider', () => {
  describe('value', () => {
    it('should return the promise value when the digest cycle is triggered', done => {
      let value = 'value';
      let promise = Promise.resolve(value);
      let mockScope = jasmine.createSpyObj('$scope', ['$apply']);

      let provider;
      mockScope.$apply.and.callFake(() => {
        expect(provider.value).toEqual(value);
        done();
      });

      provider = new Provider(mockScope, promise, null);
      jasmine.addDisposable(provider);
    });

    it('should return the defaultValue if the digest cycle has not been triggered', () => {
      let defaultValue = 'defaultValue';

      let provider = new Provider(
          jasmine.createSpyObj('$scope', ['$apply']),
          Promise.resolve('value'),
          defaultValue);
      jasmine.addDisposable(provider);
      expect(provider.value).toEqual(defaultValue);
    });
  });
});
