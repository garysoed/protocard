interface Clock {
  install: () => void;
  uninstall: () => void;
}

interface Expectation {
  toEqual: (expected: any) => void;
}

interface Jasmine {
  addCustomEqualityTester: (callback: (a: any, b: any) => boolean) => void;
  clock: () => Clock;
  createObj: (name: string) => void;
}

declare var jasmine: Jasmine;
declare function afterEach(callback: Function): void;
declare function beforeEach(callback: Function): void;
declare function describe(description: string, callback: Function): void;
declare function expect(actual: any): Expectation;
declare function it(description: string, callback: Function): void;
