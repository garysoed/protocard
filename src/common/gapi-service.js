/**
 * Interface to Gapi Client.
 * @class common.GapiService
 */
export default class {

  /**
   * @constructor
   * @param {Window} $window The window object.
   */
  constructor($window) {
    this.gapi_ = $window['gapi'];
    this.clientId_ = $window['CLIENT_ID'];
    this.gapi_.client.setApiKey($window['API_KEY']);
  }

  /**
   * Authenticates the current user.
   *
   * @method authenticate_
   * @param {Array} scopes Array of strings representing the scopes. This is just the part that
   *    comes after the auth/.
   * @param {Boolean} immediate True iff the api should try to just refresh the auth token.
   * @return {Promise} Promise that will be resolved with the authentication result when done,
   *    or rejected if authentication failed.
   * @private
   */
  authenticate_(scopes, immediate) {
    return new Promise((resolve, reject) => {
      let normalizedScopes = scopes
          .map(scope => `https://www.googleapis.com/auth/${scope}`)
          .join(' ');
      let payload = {
        client_id: this.clientId_,
        scope: normalizedScopes,
        immediate: immediate
      };

      this.gapi_.auth.authorize(payload, result => {
        if (!!result && !result.error) {
          resolve(result);
        } else {
          reject();
        }
      });
    });
  }

  /**
   * Authenticates the current user. First try to just refresh the token. If that fails, prompts
   * the OAuth prompt.
   *
   * @method authenticate
   * @param {Array} scopes Array of strings representing the scopes. This is just the part that
   *    comes after the auth/.
   * @return {Promise} Promise that will be resolved with the authentication result when done,
   *    or rejected if authentication failed.
   */
  authenticate(scopes) {
    return this.authenticate_(scopes, true)
        .catch(() => {
          return this.authenticate_(scopes, false);
        });
  }

  /**
   * @method getClientPromise
   * @param {string} name Name of the Gapi client to return.
   * @param {string} version The version of the Gapi client to return.
   * @return {Promise} Promise that will be resolved with the client object when loaded.
   */
  getClientPromise(name, version) {
    return this.gapi_.client
        .load(name, version)
        .then(() => {
          return this.gapi_.client[name];
        });
  }

  /**
   * @method newBatch
   * @return {gapi.Batch} A new batch object from gapi client.
   */
  newBatch() {
    return this.gapi_.client.newBatch();
  }
};
