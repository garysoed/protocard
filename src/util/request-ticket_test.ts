import TestBase from '../testbase';
TestBase.init();

import RequestTicket from './request-ticket';

describe('util.RequestTicket', () => {
  let mockRunner;
  let ticket;

  beforeEach(() => {
    mockRunner = jasmine.createObj('runner');
    ticket = new RequestTicket<string>(mockRunner);
  });

  describe('tryResolve_', () => {
    let mockResolve;
    let mockReject;

    beforeEach(() => {
      mockResolve = jasmine.createSpy('resolve');
      mockReject = jasmine.createSpy('reject');
    });

    it('should resolve if the runner has ran with a result', () => {
      let result = 'result';
      mockRunner.ran = true;
      mockRunner.result = result;

      ticket.tryResolve_(mockResolve, mockReject);

      expect(mockResolve).toHaveBeenCalledWith(result);
      expect(mockReject).not.toHaveBeenCalled();
    });

    it('should reject if the runner has ran with an error', () => {
      let error = 'error';
      mockRunner.ran = true;
      mockRunner.error = error;

      ticket.tryResolve_(mockResolve, mockReject);

      expect(mockResolve).not.toHaveBeenCalled();
      expect(mockReject).toHaveBeenCalledWith(error);
    });

    it('should try resolving if the runner has not ran', () => {
      let setTimeoutSpy = spyOn(window, 'setTimeout');

      mockRunner.ran = false;

      ticket.tryResolve_(mockResolve, mockReject);

      expect(mockResolve).not.toHaveBeenCalled();
      expect(mockReject).not.toHaveBeenCalled();
      expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 0);

      spyOn(ticket, 'tryResolve_');

      setTimeoutSpy.calls.argsFor(0)[0]();

      expect(ticket.tryResolve_).toHaveBeenCalledWith(mockResolve, mockReject);
    });

    it('should resolve with undefined if the ticket is not active', () => {
      spyOn(window, 'setTimeout');

      ticket.deactivate();

      ticket.tryResolve_(mockResolve, mockReject);

      expect(mockResolve).toHaveBeenCalledWith();
      expect(mockReject).not.toHaveBeenCalled();
      expect(window.setTimeout).not.toHaveBeenCalled();
    });
  });
});
