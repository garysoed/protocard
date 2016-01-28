import TestBase from '../testbase';
TestBase.init();

import Runner from './runner';

describe('util.Runner', () => {
  let mockCallback;
  let runner;

  beforeEach(() => {
    mockCallback = jasmine.createSpy('callback');
    runner = new Runner<string, string>(mockCallback);
  });

  describe('run', () => {
    it('should store the result', () => {
      let result = 'result';
      let params = 'params';
      mockCallback.and.returnValue(result);

      runner.run(params);
      expect(runner.result).toEqual(result);
      expect(runner.error).toEqual(undefined);
      expect(runner.ran).toEqual(true);
      expect(mockCallback).toHaveBeenCalledWith(params);
    });

    it('should store the thrown error', () => {
      let error = Error('error');
      mockCallback.and.throwError(error);

      runner.run('params');
      expect(runner.result).toEqual(undefined);
      expect(runner.error).toEqual(error);
      expect(runner.ran).toEqual(true);

    });

    it('should throw exception if the callback has been ran', () => {
      runner.run('params');
      expect(() => {
        runner.run('params');
      }).toThrowError(/rerun/);
    });
  });
});
