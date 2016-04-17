import Comparator from './decorator/compare';
import TestDispose from '../node_modules/gs-tools/src/testing/test-dispose';
import TestJasmine from '../node_modules/gs-tools/src/testing/test-jasmine';
import TestSetup from '../node_modules/gs-tools/src/testing/test-setup';

let called = false;
const TEST_SETUP = new TestSetup([
  TestDispose,
  TestJasmine,
]);

export default {
  init() {
    if (called) {
      return;
    }

    TEST_SETUP.setup();

    jasmine.createObj = (name) => {
      return { type: name };
    };


    jasmine.createSpyBuilder = (name, methods) => {
      let spy = jasmine.createSpyObj(name, methods);
      for (let method of methods) {
        spy[method].and.returnValue(spy);
      }
      return spy;
    };

    jasmine.cast = <T>(params: { [name: string]: any }): T => {
      let obj = <T> {};
      for (let key in params) {
        obj[key] = params[key];
      }
      return obj;
    };

    beforeEach(() => {
      jasmine.addCustomEqualityTester(Comparator.equals.bind(Comparator));
    });

    called = true;
  }
};
