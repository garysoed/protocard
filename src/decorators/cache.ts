const __cache = Symbol('cache');

class Cache {
  private data_: Map<string, any>;
  private obj_: any;

  constructor(obj: any) {
    this.data_ = new Map<string, any>();
    this.obj_ = obj;
  }

  getValue(methodName: string, delegate: Function): any {
    if (!this.data_.has(methodName)) {
      this.data_.set(methodName, delegate());
    }
    return this.data_.get(methodName);
  }

  clearAll() {
    this.data_.clear();
  }

  static get(obj: any): Cache {
    if (obj[__cache] === undefined) {
      obj[__cache] = new Cache(obj);
    }
    return obj[__cache];
  }
}

interface CacheFunc {
  (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
  clear: (obj: any) => void;
}

/**
 * Annotates getters to cache the return value.
 */
const cache: CacheFunc = <CacheFunc>function(
    target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
  const original = descriptor.get;

  if (!descriptor.get) {
    throw Error(`Property ${propertyKey} at object ${target} needs to be a getter`);
  }

  descriptor.get = function(...args) {
    let cache = Cache.get(this);
    return cache.getValue(propertyKey, original.bind(this));
  };

  return descriptor;
}

/**
 * Clears all cache in the given object.
 */
cache.clear = function(obj: any) {
  Cache.get(obj).clearAll();
};

export default cache;
