// eval(`require('babel/polyfill')`);

import Asset from './model/asset';
import Comparator from './decorator/compare';
import DisposableTestBase from '../node_modules/gs-tools/src/dispose/testing/test-base';

let called = false;

export default {
  init() {
    if (called) {
      return;
    }

    DisposableTestBase.setup(jasmine);

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
