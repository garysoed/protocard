export default class {
  $get($window) {
    if (!$window['ace']) {
      throw Error('ACE not loaded');
    }
    return $window['ace'];
  }
};
