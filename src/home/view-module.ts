import AssetServiceModule from '../asset/asset-service';
import ContextButtonModule from '../common/context-button';
import CreateAssetDialogModule from './create-asset-dialog-module';
import FileUploadModule from '../editor/file-upload-module';
import NavigateServiceModule from '../navigate/navigate-service-module';
import ViewCtrl from './view-ctrl';

export default angular
    .module('home.ViewModule', [
      'ngRoute',
      AssetServiceModule.name,
      ContextButtonModule.name,
      CreateAssetDialogModule.name,
      FileUploadModule.name,
      NavigateServiceModule.name,
    ])
    .config(($routeProvider: angular.ui.IUrlRouterProvider) => {
      $routeProvider.when(
          '/',
          {
            controller: ViewCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'src/home/view.ng',
          });
    });
