import AssetGlobalModule from './subview/global-module';
import AssetHelperEditorModule from './subview/helper-editor-module';
import AssetHelperModule from './subview/helper-module';
import AssetServiceModule from '../data/asset-service-module';
import NavigateServiceModule from '../common/navigate-service-module';
import ViewCtrl from './view-ctrl';

export default angular
    .module('asset.ViewModule', [
      'ngRoute',
      AssetGlobalModule.name,
      AssetHelperEditorModule.name,
      AssetHelperModule.name,
      AssetServiceModule.name,
      NavigateServiceModule.name
    ])
    .config($routeProvider => {
      $routeProvider.when(
          '/asset/:assetId/:section?/:helper?',
          {
            controller: ViewCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'asset/view.ng'
          });
    });
