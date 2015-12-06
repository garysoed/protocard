import AssetGlobalModule from './global/global-module';
import AssetHelperEditorModule from './helper/helper-editor-module';
import AssetHelperModule from './helper/helper-module';
import AssetImageModule from './image/image-module';
import AssetPartialEditorModule from './partial/partial-editor-module';
import AssetPartialModule from './partial/partial-module';
import AssetServiceModule from '../asset/asset-service-module';
import AssetTemplateModule from './template/template-module';
import AssetTextModule from './text/text-module';
import DataModule from '../data/data-module';
import NavigateServiceModule from '../common/navigate-service-module';
import RenderModule from '../render/render-module';
import ViewCtrl from './view-ctrl';

export default angular
    .module('asset.ViewModule', [
      'ngRoute',
      AssetGlobalModule.name,
      AssetHelperEditorModule.name,
      AssetHelperModule.name,
      AssetImageModule.name,
      AssetPartialModule.name,
      AssetPartialEditorModule.name,
      AssetServiceModule.name,
      AssetTemplateModule.name,
      AssetTextModule.name,
      DataModule.name,
      NavigateServiceModule.name,
      RenderModule.name
    ])
    .config($routeProvider => {
      $routeProvider.when(
          '/asset/:assetId/:section?/:subitemId?',
          {
            controller: ViewCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'asset/view.ng'
          });
    });
