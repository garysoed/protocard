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

  clearAll(): void {
    this.data_.clear();
  }

  static get(obj: any): Cache {
    if (obj[__cache] === undefined) {
      obj[__cache] = new Cache(obj);
    }
    return obj[__cache];
  }
}

interface ICacheFunc {
  (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>):
      TypedPropertyDescriptor<any>;
  clear: (obj: any) => void;
}

/**
 * Annotates getters to cache the return value.
 */
const cache: ICacheFunc = <ICacheFunc>function(
    target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
  if (descriptor.get) {
    const original = descriptor.get;
    descriptor.get = function(...args: any[]): any {
      return Cache.get(this).getValue(propertyKey, original.bind(this));
    };
  } else if (descriptor.value) {
    const original = descriptor.value;
    descriptor.value = function(...args: any[]): any {
      return Cache.get(this).getValue(propertyKey, original.bind(this));
    };
  } else {
    throw Error(`Property ${propertyKey} has to be a getter or a function`);
  }

  return descriptor;
};

/**
 * Clears all cache in the given object.
 */
cache.clear = function(obj: any): void {
  Cache.get(obj).clearAll();
};

export default cache;
