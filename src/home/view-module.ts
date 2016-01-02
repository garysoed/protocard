import AssetServiceModule from '../asset/asset-service-module';
import CreateAssetDialogModule from './create-asset-dialog-module';
import NavigateServiceModule from '../navigate/navigate-service-module';
import ViewCtrl from './view-ctrl';

export default angular
    .module('pc.home.ViewModule', [
      'ngRoute',
      AssetServiceModule.name,
      CreateAssetDialogModule.name,
      NavigateServiceModule.name
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
