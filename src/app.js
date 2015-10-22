import CreateViewModule from './create/view-module';
import GenerateViewModule from './generate/view-module';
import HomeViewModule from './home/view-module';

angular
    .module('pc.App', [
      'ngMaterial',
      'ngMessages',
      'ngRoute',
      CreateViewModule.name,
      GenerateViewModule.name,
      HomeViewModule.name
    ])
    .config(($mdThemingProvider, $routeProvider) => {
      $mdThemingProvider
          .theme('default')
          .primaryPalette('deep-purple')
          .accentPalette('green');
      $routeProvider.otherwise('/');
    });
