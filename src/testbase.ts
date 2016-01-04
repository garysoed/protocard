eval(`require('babel/polyfill')`);

import Asset from './model/asset';
import Comparator from './decorators/compare';

let called = false;

export default {
  init() {
    if (called) {
      return;
    }

    jasmine.createObj = (name) => {
      return { type: name };
    };

    jasmine.cast = <T>(params: { [name: string]: any }): T => {
      let obj = <T>{};
      for (let key in params) {
        obj[key] = params[key];
      }
      return obj;
    };

    beforeEach(() => {
      jasmine.addCustomEqualityTester(Comparator.equals.bind(Comparator));
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    called = true;
  }
};
