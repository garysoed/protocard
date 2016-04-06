declare namespace angular {
  interface IComponentOptions {
    $routeConfig?: {path: string, name: string, component: string, useAsDefault?: boolean}[];
  }
}
