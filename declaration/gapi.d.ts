declare module gapi {
  interface Auth {
    authorize: (payload: any, callback: (result: any) => void) => void;
  }

  interface Batch<T> extends Promise<T> {
    add: (request: Request) => void;
  }

  interface Client {
    load: (name: string, version: string) => Promise<void>;
    newBatch: <T>() => gapi.Batch<T>;
    setApiKey: (key: string) => gapi.Client;
  }

  interface Request extends Promise<any> {}
}

declare module gapi.drive {
  interface Children {
    list: (payload: { folderId: string, q: string }) => Request;
  }

  interface Files {
    get: (payload: { fileId: string }) => Request;
  }

  interface Client {
    children: gapi.drive.Children;
    files: gapi.drive.Files;
  }
}

interface Gapi {
  auth: gapi.Auth;
  client: gapi.Client;
}
