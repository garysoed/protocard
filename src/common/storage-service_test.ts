import TestBase from '../testbase';
TestBase.init();

import Serializer, { Field, Serializable }
    from '../../node_modules/gs-tools/src/data/a-serializable';
import { StorageService } from './storage-service';

@Serializable('FakeClass')
class FakeClass {
  @Field('data') data: any;

  constructor(data: any) {
    this.data = data;
  }

  static fromJSON(json: any): FakeClass {
    return new this(json.data);
  }
}

describe('common.StorageService', () => {
  const NAMESPACE = 'namespace';
  let service;
  let mockStorage;

  beforeEach(() => {
    mockStorage = jasmine.createSpyObj('storage', ['getItem', 'removeItem', 'setItem']);
    let mockWindow = <Window> {};
    mockWindow['localStorage'] = mockStorage;
    service = new StorageService(mockWindow, NAMESPACE);
  });

  describe('getItem', () => {
    it('should parse the JSON using the given ctor', () => {
      let data = 'data';
      let fakeClass = new FakeClass(data);
      mockStorage.getItem.and.returnValue(JSON.stringify(fakeClass));

      expect(service.getItem('key', FakeClass).data).toEqual(data);
      expect(mockStorage.getItem).toHaveBeenCalledWith(`${NAMESPACE}.key`);
    });

    it('should return JSON if the ctor has no fromJSON', () => {
      let data = { a: 1 };
      mockStorage.getItem.and.returnValue(JSON.stringify(data));

      expect(service.getItem('key', Object)).toEqual(data);
    });

    it('should return the default value if value cannot be found', () => {
      let defaultValue = 3;

      mockStorage.getItem.and.returnValue(null);
      expect(service.getItem('key', Object, defaultValue)).toEqual(defaultValue);
    });
  });

  describe('setItem', () => {
    it('should set the item in the storage', () => {
      let fakeClass = new FakeClass('data');

      service.setItem('key', fakeClass);

      expect(mockStorage.setItem)
          .toHaveBeenCalledWith(`${NAMESPACE}.key`, JSON.stringify(Serializer.toJSON(fakeClass)));
    });
  });

  describe('removeItem', () => {
    it('should call the correct method', () => {
      let key = 'key';
      service.removeItem(key);

      expect(mockStorage.removeItem).toHaveBeenCalledWith(`${NAMESPACE}.${key}`);
    });
  });
});
