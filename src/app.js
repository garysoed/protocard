import AssetViewModule from './asset/view-module';
import GenerateViewModule from './generate/view-module';
import HomeViewModule from './home/view-module';

angular
    .module('pc.App', [
      'ngMaterial',
      'ngMessages',
      'ngRoute',
      AssetViewModule.name,
      GenerateViewModule.name,
      HomeViewModule.name
    ])
    .config(($mdIconProvider, $mdThemingProvider, $routeProvider) => {
      $mdIconProvider
          .defaultFontSet('material-icons');
      $mdThemingProvider
          .theme('default')
          .primaryPalette('deep-purple')
          .accentPalette('light-green');
      $routeProvider.otherwise('/');
    });
