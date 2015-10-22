import AssetServiceModule from '../data/asset-service-module';
import LoadTabModule from '../load/tab-module';
import ViewCtrl from './view-ctrl';

export default angular
    .module('create.ViewModule', [
      'ngRoute',
      AssetServiceModule.name,
      LoadTabModule.name
    ])
    .config($routeProvider => {
      $routeProvider.when(
          '/create/:assetId/:section?',
          {
            controller: ViewCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'create/view.ng'
          });
    });
