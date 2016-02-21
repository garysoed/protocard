declare module jasmine {
  function createObj(name: string): any;
  function createSpyBuilder(name: string, methods: string[]): any;
  function cast<T>(params: { [name: string]: any }): T;

  interface IDoneFn {
    (): void;
    fail: () => void;
  }
}
