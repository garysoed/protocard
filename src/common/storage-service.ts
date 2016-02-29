import Serializer from '../model/serializable';

/**
 * Service to manage local storage.
 */
export class StorageService<T> {

  private storage_: Storage;
  private namespace_: string;

  /**
   * @param $window The window object.
   * @param namespace Namespace of the storage.
   */
  constructor($window: Window, namespace: string) {
    this.storage_ = $window.localStorage;
    this.namespace_ = namespace;
  }

  /**
   * @param key Key of the item to be returned.
   * @param ctor Constructor of the item to be returned.
   * @param [defaultValue] Default value to return if the key cannot be found. Defaults to null.
   * @return The stored value corresponding to the given key. If the constructor has a fromJSON
   *    method, this method will use that method to deserialize the JSON. Otherwise, this will
   *    return the JSON.
   */
  getItem(key: string, ctor: Function, defaultValue: any = null): T {
    let value = this.storage_.getItem(`${this.namespace_}.${key}`);

    if (value === null) {
      return defaultValue;
    } else {
      let json = JSON.parse(value);
      return Serializer.fromJSON(json);
    }
  }

  /**
   * Stores the given item in the storage.
   *
   * @param key Key to store the item in.
   * @param item The item to be stored.
   */
  setItem(key: string, item: T): void {
    this.storage_.setItem(`${this.namespace_}.${key}`, JSON.stringify(Serializer.toJSON(item)));
  }

  removeItem(key: string): void {
    this.storage_.removeItem(`${this.namespace_}.${key}`);
  }
};

export default angular
    .module('common.StorageServiceModule', [])
    .service('StorageService', ($window: Window) => {
      return new StorageService($window, 'pc');
    });
