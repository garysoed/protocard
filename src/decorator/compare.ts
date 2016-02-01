const __fields = Symbol('fields2');

export default {
  equals: function<T>(a: T, b: T): boolean {
    if (!(a instanceof Object) || !(b instanceof Object)) {
      return a === b;
    }

    let ctor = a.constructor;
    if (!(a instanceof ctor) && !(b instanceof ctor)) {
      return undefined;
    }

    let fields: Set<string> = ctor.prototype[__fields];
    if (fields) {
      let isEqual = true;
      fields.forEach(field => {
        isEqual = isEqual && this.equals(a[field], b[field]);
      });
      return isEqual;
    } else if (ctor === String) {
      return a === b;
    } else {
      // TODO(gs): Compare the keys.
      return undefined;
    }
  }
};

export function Comparable(
    target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
  if (!descriptor.get) {
    throw Error(`Field ${propertyKey} must be a getter`);
  }

  if (!target[__fields]) {
    target[__fields] = new Set<string>();
  }

  target[__fields].add(propertyKey);
  return descriptor;
};
