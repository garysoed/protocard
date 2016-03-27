/**
 * @param referenceName Name of the reference to the global object.
 * @return Provider Class that provides the specified global object.
 */

// TODO(gs): Move to gs-tools
export default function(referenceName: string): any {
  let Provider = function(): void { /* noop */ };
  Provider.prototype.$get = function($window: Window): any {
    if (!$window[referenceName]) {
      throw Error(`${referenceName} not loaded`);
    }

    return $window[referenceName];
  };

  return Provider;
};
