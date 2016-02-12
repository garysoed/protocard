declare module jasmine {
  function addDisposable<T>(disposable: T): T;
  function createObj(name: string): any;
  function createSpyBuilder(name: string, methods: string[]): any;
  function cast<T>(params: { [name: string]: any }): T;
}
