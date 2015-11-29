import AssetDataModule from './data/data-module';
import AssetGlobalModule from './global/global-module';
import AssetHelperEditorModule from './helper/helper-editor-module';
import AssetHelperModule from './helper/helper-module';
import AssetImageModule from './image/image-module';
import AssetPartialModule from './partial/partial-module';
import AssetRenderModule from './render/render-module';
import AssetServiceModule from '../data/asset-service-module';
import AssetTemplateModule from './template/template-module';
import AssetTextModule from './text/text-module';
import NavigateServiceModule from '../common/navigate-service-module';
import ViewCtrl from './view-ctrl';

export default angular
    .module('asset.ViewModule', [
      'ngRoute',
      AssetDataModule.name,
      AssetGlobalModule.name,
      AssetHelperEditorModule.name,
      AssetHelperModule.name,
      AssetImageModule.name,
      AssetPartialModule.name,
      AssetRenderModule.name,
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
