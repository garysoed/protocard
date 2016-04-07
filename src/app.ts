import AssetViewModule from './asset/asset-view';
import HomeViewModule from './home/home-view';


angular
    .module('pc.App', [
      'ngComponentRouter',
      'ngMaterial',
      'ngMessages',
      AssetViewModule.name,
      HomeViewModule.name,
    ])
    .component('app', {
      $routeConfig: [
        {
          component: 'homeView',
          name: 'Home',
          path: '/home',
          useAsDefault: true
        },
        {
          component: 'assetView',
          name: 'Asset',
          path: '/asset/:assetId',
        },
      ],
      templateUrl: 'src/app.ng'
    })
    .config(($mdIconProvider, $mdThemingProvider, $sceProvider) => {
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
      $sceProvider.enabled(false);
    })
    .value('$routerRootComponent', 'app');

angular.bootstrap(document.body, ['pc.App']);
