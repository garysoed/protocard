declare module jasmine {
  function createObj(name: string): any;
  function cast<T>(params: { [name: string]: any }): T;
}
