import AssetServiceModule from './asset-service-module';
import DataModule from '../data/data-module';
import GlobalModule from '../global/global-module';
import HelperEditorModule from '../helper/helper-editor-module';
import HelperModule from '../helper/helper-module';
import ImageModule from '../image/image-module';
import NavigateButtonModule from '../common/navigate-button-module';
import NavigateServiceModule from '../common/navigate-service-module';
import PartialEditorModule from '../partial/partial-editor-module';
import PartialModule from '../partial/partial-module';
import RenderModule from '../render/render-module';
import TemplateModule from '../template/template-module';
import TextModule from '../text/text-module';
import ViewCtrl from './view-ctrl';

export default angular
    .module('asset.ViewModule', [
      'ngRoute',
      AssetServiceModule.name,
      DataModule.name,
      GlobalModule.name,
      HelperEditorModule.name,
      HelperModule.name,
      ImageModule.name,
      NavigateButtonModule.name,
      NavigateServiceModule.name,
      PartialModule.name,
      PartialEditorModule.name,
      RenderModule.name,
      TemplateModule.name,
      TextModule.name,
    ])
    .config($routeProvider => {
      $routeProvider.when(
          '/asset/:assetId',
          {
            controller: ViewCtrl,
            controllerAs: 'ctrl',
            reloadOnSearch: false,
            templateUrl: 'asset/view.ng'
          });
    });
