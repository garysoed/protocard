import TestBase from '../testbase';

import GapiService from './gapi-service';

describe('common.GapiService', () => {
  let CLIENT_ID = 'CLIENT_ID';
  let API_KEY = 'API_KEY';
  let mockGapiAuth;
  let mockGapiClient;
  let $window;
  let service;

  beforeEach(() => {
    mockGapiAuth = jasmine.createSpyObj('GapiAuth', ['authorize']);
    mockGapiClient = jasmine.createSpyObj('GapiClient', ['load', 'newBatch', 'setApiKey']);
    service = new GapiService({
      gapi: {
        auth: mockGapiAuth,
        client: mockGapiClient
      },
      API_KEY: API_KEY,
      CLIENT_ID: CLIENT_ID
    });
  });

  it('should set the api key when initialized', () => {
    expect(mockGapiClient.setApiKey).toHaveBeenCalledWith(API_KEY);
  });

  describe('authenticate', () => {
    let SCOPE_PREFIX = 'https://www.googleapis.com/auth/';

    it('should try to refresh the authorization token', done => {
      let scopes = ['a', 'b'];
      let expectedScopes = `${SCOPE_PREFIX}${scopes[0]} ${SCOPE_PREFIX}${scopes[1]}`;
      let result = {};

      mockGapiAuth.authorize.and.callFake((payload, callback) => {
        callback(result);
      });

      service.authenticate(scopes)
          .then(actualResult => {
            expect(mockGapiAuth.authorize).toHaveBeenCalledWith(
                jasmine.objectContaining({
                  client_id: CLIENT_ID,
                  scope: expectedScopes,
                  immediate: true
                }),
                jasmine.any(Function));
            expect(result).toEqual(actualResult);
            done();
          }, done.fail);
    });

    it('should fallback to oauth prompt if refresh fails', done => {
      let scopes = ['a', 'b'];
      let expectedScopes = `${SCOPE_PREFIX}${scopes[0]} ${SCOPE_PREFIX}${scopes[1]}`;
      let result = {};

      mockGapiAuth.authorize.and.callFake((payload, callback) => {
        if (payload.immediate) {
          callback();
        } else {
          callback(result);
        }
      });

      service.authenticate(scopes)
          .then(actualResult => {
            expect(mockGapiAuth.authorize).toHaveBeenCalledWith(
                jasmine.objectContaining({
                  client_id: CLIENT_ID,
                  scope: expectedScopes,
                  immediate: true
                }),
                jasmine.any(Function));
            expect(mockGapiAuth.authorize).toHaveBeenCalledWith(
                jasmine.objectContaining({
                  client_id: CLIENT_ID,
                  scope: expectedScopes,
                  immediate: false
                }),
                jasmine.any(Function));
            expect(result).toEqual(actualResult);
            done();
          }, done.fail);
    });

    it('should reject the promise if the oauth prompt fails', done => {
      let scopes = ['a', 'b'];
      let expectedScopes = `${SCOPE_PREFIX}${scopes[0]} ${SCOPE_PREFIX}${scopes[1]}`;

      mockGapiAuth.authorize.and.callFake((payload, callback) => {
        callback();
      });

      service.authenticate(scopes)
          .then(done.fail, () => {
            done();
          });
    });
  });

  describe('getClientPromise', () => {
    it('should load the client and resolve it', done => {
      let name = 'name';
      let version = 'version';
      let client = {};
      mockGapiClient[name] = client;
      mockGapiClient.load.and.returnValue(Promise.resolve());

      service.getClientPromise(name, version)
          .then(actualClient => {
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
