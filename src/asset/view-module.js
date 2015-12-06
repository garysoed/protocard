import AssetPartialEditorModule from './partial/partial-editor-module';
import AssetPartialModule from './partial/partial-module';
import AssetServiceModule from '../asset/asset-service-module';
import DataModule from '../data/data-module';
import GlobalModule from '../global/global-module';
import HelperEditorModule from '../helper/helper-editor-module';
import HelperModule from '../helper/helper-module';
import ImageModule from '../image/image-module';
import NavigateServiceModule from '../common/navigate-service-module';
import RenderModule from '../render/render-module';
import TemplateModule from '../template/template-module';
import TextModule from '../text/text-module';
import ViewCtrl from './view-ctrl';

export default angular
    .module('asset.ViewModule', [
      'ngRoute',
      AssetPartialModule.name,
      AssetPartialEditorModule.name,
      AssetServiceModule.name,
      DataModule.name,
      GlobalModule.name,
      HelperEditorModule.name,
      HelperModule.name,
      ImageModule.name,
      NavigateServiceModule.name,
      RenderModule.name,
      TemplateModule.name,
      TextModule.name,
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
