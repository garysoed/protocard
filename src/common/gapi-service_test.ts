import TestBase from '../testbase';
TestBase.init();

import GapiService from './gapi-service';

describe('common.GapiService', () => {
  let CLIENT_ID = 'CLIENT_ID';
  let API_KEY = 'API_KEY';
  let mockGapiAuth;
  let mockGapiClient;
  let service;

  beforeEach(() => {
    mockGapiAuth = jasmine.createSpyObj('GapiAuth', ['authorize']);
    mockGapiClient = jasmine.createSpyObj('GapiClient', ['load', 'newBatch', 'setApiKey']);

    let mock$window = <Window> {};
    mock$window['gapi'] = {
      auth: mockGapiAuth,
      client: mockGapiClient,
    };
    mock$window['API_KEY'] = API_KEY;
    mock$window['CLIENT_ID'] = CLIENT_ID;
    service = new GapiService(mock$window);
  });

  it('should set the api key when initialized', () => {
    expect(mockGapiClient.setApiKey).toHaveBeenCalledWith(API_KEY);
  });

  describe('authenticate', () => {
    let SCOPE_PREFIX = 'https://www.googleapis.com/auth/';

    it('should try to refresh the authorization token', (done: jasmine.IDoneFn) => {
      let scopes = ['a', 'b'];
      let expectedScopes = `${SCOPE_PREFIX}${scopes[0]} ${SCOPE_PREFIX}${scopes[1]}`;
      let result = {};

      mockGapiAuth.authorize.and.callFake((payload: any, callback: (data: any) => void) => {
        callback(result);
      });

      service.authenticate(scopes)
          .then((actualResult: void) => {
            expect(mockGapiAuth.authorize).toHaveBeenCalledWith(
                jasmine.objectContaining({
                  client_id: CLIENT_ID,
                  immediate: true,
                  scope: expectedScopes,
                }),
                jasmine.any(Function));
            expect(result).toEqual(actualResult);
            done();
          }, done.fail);
    });

    it('should fallback to oauth prompt if refresh fails', (done: jasmine.IDoneFn) => {
      let scopes = ['a', 'b'];
      let expectedScopes = `${SCOPE_PREFIX}${scopes[0]} ${SCOPE_PREFIX}${scopes[1]}`;
      let result = {};

      mockGapiAuth.authorize.and.callFake((payload: any, callback: Function) => {
        if (payload.immediate) {
          callback();
        } else {
          callback(result);
        }
      });

      service.authenticate(scopes)
          .then((actualResult: any) => {
            expect(mockGapiAuth.authorize).toHaveBeenCalledWith(
                jasmine.objectContaining({
                  client_id: CLIENT_ID,
                  immediate: true,
                  scope: expectedScopes,
                }),
                jasmine.any(Function));
            expect(mockGapiAuth.authorize).toHaveBeenCalledWith(
                jasmine.objectContaining({
                  client_id: CLIENT_ID,
                  immediate: false,
                  scope: expectedScopes,
                }),
                jasmine.any(Function));
            expect(result).toEqual(actualResult);
            done();
          }, done.fail);
    });

    it('should reject the promise if the oauth prompt fails', (done: jasmine.IDoneFn) => {
      let scopes = ['a', 'b'];

      mockGapiAuth.authorize.and.callFake((payload: any, callback: Function) => {
        callback();
      });

      service.authenticate(scopes)
          .then(done.fail, done);
    });
  });

  describe('getClientPromise', () => {
    it('should load the client and resolve it', (done: jasmine.IDoneFn) => {
      let name = 'name';
      let version = 'version';
      let client = {};
      mockGapiClient[name] = client;
      mockGapiClient.load.and.returnValue(Promise.resolve());

      service.getClientPromise(name, version)
          .then((actualClient: any) => {
            expect(mockGapiClient.load).toHaveBeenCalledWith(name, version);
            expect(actualClient).toEqual(client);
            done();
          }, done.fail);
    });
  });

  describe('newBatch', () => {
    it('should return a new Gapi client batch', () => {
      let batch = {};
      mockGapiClient.newBatch.and.returnValue(batch);
      expect(service.newBatch()).toEqual(batch);
    });
  });
});
