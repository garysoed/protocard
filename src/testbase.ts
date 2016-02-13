// eval(`require('babel/polyfill')`);

import Asset from './model/asset';
import Comparator from './decorator/compare';
import { TRACKED_DISPOSABLES, Flags as DisposableFlags } from './util/disposable';

let called = false;

let DISPOSABLES = [];

export default {
  init() {
    if (called) {
      return;
    }

    jasmine.addDisposable = disposable => {
      DISPOSABLES.push(disposable);
      return disposable;
    };

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
      let obj = <T>{};
      for (let key in params) {
        obj[key] = params[key];
      }
      return obj;
    };

    beforeEach(() => {
      DISPOSABLES = [];
      jasmine.addCustomEqualityTester(Comparator.equals.bind(Comparator));
      DisposableFlags.enableTracking = true;
    });

    afterEach(() => {
      DISPOSABLES.forEach(disposable => disposable.dispose());
      DisposableFlags.enableTracking = false;

      expect(TRACKED_DISPOSABLES).toEqual([]);

      TRACKED_DISPOSABLES.splice(0, TRACKED_DISPOSABLES.length);
    });

    called = true;
  }
};
