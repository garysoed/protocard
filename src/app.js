import GenerateViewModule from './generate/view-module';
import HomeViewModule from './home/view-module';

angular
    .module('pc.App', [
      'ngMaterial',
      'ngMessages',
      'ngRoute',
      GenerateViewModule.name,
      HomeViewModule.name
    ])
    .config(($mdThemingProvider, $routeProvider) => {
      $mdThemingProvider
          .theme('default')
          .primaryPalette('deep-purple')
          .accentPalette('green')
      $routeProvider.otherwise('/');
    });
