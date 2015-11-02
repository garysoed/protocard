import AccordionModule from '../common/accordion-module';
import AssetGlobalModule from './subview/global-module';
import AssetServiceModule from '../data/asset-service-module';
import NavigateServiceModule from '../common/navigate-service-module';
import ViewCtrl from './view-ctrl';

export default angular
    .module('asset.ViewModule', [
      'ngRoute',
      AccordionModule.name,
      AssetGlobalModule.name,
      AssetServiceModule.name,
      NavigateServiceModule.name
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
