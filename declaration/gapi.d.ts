declare module gapi {
  interface Auth {
    authorize: (payload: any, callback: (result: any) => void) => void;
  }

  interface Batch<T> extends Promise<T> {

  }

  interface Client {
    load: (name: string, version: string) => Promise<void>;
    newBatch: <T>() => gapi.Batch<T>;
    setApiKey: (key: string) => gapi.Client;
  }
}

interface Gapi {
  auth: gapi.Auth;
  client: gapi.Client;
}
