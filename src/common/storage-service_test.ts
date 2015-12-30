import StorageService from './storage-service';

class FakeClass {
  data: any;

  constructor(data) {
    this.data = data;
  }

  toJSON() {
    return {
      data: this.data
    };
  }

  static fromJSON(json) {
    return new this(json.data);
  }
}

describe('common.StorageService', () => {
  const NAMESPACE = 'namespace';
  let service;
  let mockStorage;

  beforeEach(() => {
    mockStorage = jasmine.createSpyObj('storage', ['getItem', 'setItem']);
    let mockWindow = <Window>{};
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
          .toHaveBeenCalledWith(`${NAMESPACE}.key`, JSON.stringify(fakeClass));
    });
  });
});
