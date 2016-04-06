import AssetViewModule from './asset/asset-view';
import HomeViewModule from './home/home-view';


angular
    .module('pc.App', [
      'ngComponentRouter',
      'ngMaterial',
      'ngMessages',
      'ngRoute',
      AssetViewModule.name,
      HomeViewModule.name,
    ])
    .component('app', {
      $routeConfig: [
        { path: '/home', name: 'Home', component: 'homeView', useAsDefault: true },
        { path: '/asset/:assetId', name: 'Asset', component: 'assetView' },
      ],
      templateUrl: 'src/app.ng'
    })
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
      $sceProvider.enabled(false);
    })
    .value('$routerRootComponent', 'app');
