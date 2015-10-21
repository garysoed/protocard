import AssetServiceModule from '../data/asset-service-module';
import CreateAssetDialogModule from './create-asset-dialog-module';
import ViewCtrl from './view-ctrl';

export default angular
    .module('pc.home.ViewModule', [
      'ngRoute',
      AssetServiceModule.name,
      CreateAssetDialogModule.name
    ])
    .config($routeProvider => {
      $routeProvider.when(
          '/',
          {
            controller: ViewCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'home/view.ng'
          });
    });
