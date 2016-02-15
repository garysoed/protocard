import TestBase from '../testbase';
TestBase.init();

import Comparator, { Comparable } from './compare';

describe('decorators.Compare', () => {
  class BasicClass {
    private a_: any;

    constructor(a: any) {
      this.a_ = a;
    }

    @Comparable get a(): any { return this.a_; }
  }

  class CompositeClass {
    private basic_: BasicClass;
    private f_: any;

    constructor(basic: BasicClass, f: any) {
      this.basic_ = basic;
      this.f_ = f;
    }

    @Comparable get basic(): BasicClass { return this.basic_; }
    @Comparable get f(): any { return this.f_; }
  }

  it('should handle basic classes', () => {
    let basic = new BasicClass('value');
    let same = new BasicClass('value');
    let different = new BasicClass('different');

    expect(Comparator.equals(basic, same)).toEqual(true);
    expect(Comparator.equals(basic, different)).toEqual(false);
  });

  it('should handle composite classes', () => {
    let basic = new BasicClass('value');
    let composite = new CompositeClass(basic, 'composite');
    let same = new CompositeClass(basic, 'composite');
    let different1 = new CompositeClass(null, 'composite');
    let different2 = new CompositeClass(basic, null);

    expect(Comparator.equals(composite, same)).toEqual(true);
    expect(Comparator.equals(composite, different1)).toEqual(false);
    expect(Comparator.equals(composite, different2)).toEqual(false);
  });
});
