/**
 * Interface to Gapi Client.
 */
export default class {
  private gapi_: Gapi;
  private clientId_: string;

  /**
   * @param $window The window object.
   */
  constructor($window: Window) {
    this.gapi_ = $window['gapi'];
    this.clientId_ = $window['CLIENT_ID'];
    this.gapi_.client.setApiKey($window['API_KEY']);
  }

  /**
   * Authenticates the current user.
   *
   * @param scopes Array of strings representing the scopes. This is just the part that
   *    comes after the auth/.
   * @param immediate True iff the api should try to just refresh the auth token.
   * @return Promise that will be resolved with the authentication result when done, or rejected if
   *    authentication failed.
   */
  private authenticate_(scopes: string[], immediate: boolean): Promise<any> {
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
   * @param scopes Array of strings representing the scopes. This is just the part that
   *    comes after the auth/.
   * @return Promise that will be resolved with the authentication result when done, or rejected if
   *    authentication failed.
   */
  authenticate(scopes: string[]): Promise<any> {
    return this.authenticate_(scopes, true)
        .catch(() => {
          return this.authenticate_(scopes, false);
        });
  }

  /**
   * @param name Name of the Gapi client to return.
   * @param version The version of the Gapi client to return.
   * @return Promise that will be resolved with the client object when loaded.
   */
  getClientPromise(name: string, version: string): Promise<void> {
    return this.gapi_.client
        .load(name, version)
        .then(() => {
          return this.gapi_.client[name];
        });
  }

  /**
   * @return A new batch object from gapi client.
   */
  newBatch(): gapi.Batch<any> {
    return this.gapi_.client.newBatch();
  }
};
