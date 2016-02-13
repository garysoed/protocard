import TestBase from '../testbase';
TestBase.init();

import Listenable from './listenable';

describe('util.Listenable', () => {
  let listenable;

  beforeEach(() => {
    listenable = new Listenable<string>();
    jasmine.addDisposable(listenable);
  });

  describe('dispose', () => {
    it('should clear the callback map', () => {
      let mockCallback = jasmine.createSpy('Callback');
      let event = 'event';
      jasmine.addDisposable(listenable.on(event, mockCallback));
      listenable.dispose();

      listenable.dispatch(event);

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('dispatch', () => {
    it('should call all the registered callbacks', () => {
      let mockCallback = jasmine.createSpy('Callback');
      let event = 'event';
      let payload = jasmine.createObj('payload');
      jasmine.addDisposable(listenable.on(event, mockCallback));

      let setTimeoutSpy = spyOn(window, 'setTimeout');

      listenable.dispatch(event, payload);

      expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 0);
      setTimeoutSpy.calls.argsFor(0)[0]();

      expect(mockCallback).toHaveBeenCalledWith(payload);
    });

    it('should handle case when no callbacks are registered', () => {
      expect(() => {
        listenable.dispatch('event', 'payload');
      }).not.toThrow();
    });
  });

  describe('on', () => {
    it('should return disposable function that stops listening to the event', () => {
      let mockCallback = jasmine.createSpy('Callback');
      let event = 'event';

      let disposableFunction = listenable.on(event, mockCallback);
      disposableFunction.dispose();

      listenable.dispatch(event);

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });
});
