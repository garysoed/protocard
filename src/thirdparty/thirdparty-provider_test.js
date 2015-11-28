import TestBase from '../testbase';

import ThirdpartyProvider from './thirdparty-provider';

describe('thirdparty.ThirdpartyProvider', () => {
  it('should return a provider that returns the specified object', () => {
    let objectName = 'name';
    let providerCtor = ThirdpartyProvider(objectName);
    let object = {};
    let provider = new providerCtor();
    expect(provider.$get({ [objectName]: object })).toEqual(object);
  });

  it('should throw an error if the object does not exist', () => {
    let providerCtor = ThirdpartyProvider('objectName');
    let provider = new providerCtor();
    expect(() => {
      provider.$get({});
    }).toThrowError(/not loaded/);
  });
});
