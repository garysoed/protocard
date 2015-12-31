eval(`require('babel/polyfill')`);

import Asset from './model/asset';
import FunctionObject from './model/function-object';

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
      jasmine.addCustomEqualityTester(Asset.equals.bind(Asset));
      jasmine.addCustomEqualityTester(FunctionObject.equals.bind(FunctionObject));
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    called = true;
  }
};
