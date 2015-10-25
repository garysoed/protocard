import AssetServiceModule from '../data/asset-service-module';
import NavigateServiceModule from '../common/navigate-service-module';
import SettingsCardModule from './settings-card-module';
import ViewCtrl from './view-ctrl';

export default angular
    .module('asset.ViewModule', [
      'ngRoute',
      AssetServiceModule.name,
      NavigateServiceModule.name,
      SettingsCardModule.name
    ])
    .config($routeProvider => {
      $routeProvider.when(
          '/asset/:assetId/:section?',
          {
            controller: ViewCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'asset/view.ng'
          });
    });
