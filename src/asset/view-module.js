import AssetGlobalModule from './global/global-module';
import AssetHelperEditorModule from './helper/helper-editor-module';
import AssetHelperModule from './helper/helper-module';
import AssetImageModule from './image/image-module';
import AssetServiceModule from '../data/asset-service-module';
import AssetTemplateModule from './template/template-module';
import AssetTextModule from './text/text-module';
import NavigateServiceModule from '../common/navigate-service-module';
import ViewCtrl from './view-ctrl';

export default angular
    .module('asset.ViewModule', [
      'ngRoute',
      AssetGlobalModule.name,
      AssetHelperEditorModule.name,
      AssetHelperModule.name,
      AssetImageModule.name,
      AssetServiceModule.name,
      AssetTemplateModule.name,
      AssetTextModule.name,
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
