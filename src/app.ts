import AssetViewModule from './asset/view';
import HomeViewModule from './home/view';


angular
    .module('pc.App', [
      'ngMaterial',
      'ngMessages',
      'ngRoute',
      AssetViewModule.name,
      HomeViewModule.name,
    ])
    .config(($mdIconProvider, $mdThemingProvider, $routeProvider, $sceProvider) => {
      $mdIconProvider
          .defaultFontSet('material-icons');
      $mdThemingProvider
          .theme('default')
          .primaryPalette('deep-purple')
          .accentPalette('light-green');
      $mdThemingProvider
          .theme('editor')
          .primaryPalette('deep-purple')
          .accentPalette('light-green')
          .dark();
      $routeProvider.otherwise('/');
      $sceProvider.enabled(false);
    });

angular.bootstrap(document.body, ['pc.App'], {strictDi: false});
