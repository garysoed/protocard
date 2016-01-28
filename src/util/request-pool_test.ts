import TestBase from '../testbase';

import RequestPool from './request-pool';

describe('util.RequestPool', () => {
  describe('queue', () => {
    it('should return a ticket that resolves the value resolved by the callback function', done => {
      let value = 'value';
      let callbackFn = jasmine.createSpy('callback');
      callbackFn.and.returnValue(Promise.resolve(value));
      let params = { a: 1, b: 2 };
      let pool = new RequestPool(callbackFn);

      pool.queue(params).promise
          .then(returnValue => {
            expect(callbackFn).toHaveBeenCalledWith(params);
            expect(returnValue).toEqual(value);
            done();
          }, done.fail);
    });

    it('should put multiple queues in a sequence', done => {
      let isExecuting = false;
      let callbackFn = jasmine.createSpy('callback').and.callFake(params => {
        expect(isExecuting).toEqual(false);
        isExecuting = true;
        return Promise.resolve(params)
            .then(() => {
              isExecuting = false;
            })
            .then(() => params);
      });

      let pool = new RequestPool(callbackFn);
      pool.queue({ a: 1 });
      pool.queue({ b: 2 }).promise
          .then(done, done.fail);
    });
  });
});
