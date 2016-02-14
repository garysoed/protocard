/**
 * @param referenceName Name of the reference to the global object.
 * @return Provider Class that provides the specified global object.
 */
export default function(referenceName: string): any {
  let Provider = function() { };
  Provider.prototype.$get = function($window) {
    if (!$window[referenceName]) {
      throw Error(`${referenceName} not loaded`);
    }

    return $window[referenceName];
  };

  return Provider;
};
