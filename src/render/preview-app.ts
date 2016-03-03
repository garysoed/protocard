import DomServiceModule from '../thirdparty/dom-service-module';
import Html2canvasServiceModule from '../thirdparty/html2canvas-service-module';
import PreviewAppCtrl from './preview-app-ctrl';

angular
    .module('pc.PreviewApp', [
      'ngMaterial',
      'ngRoute',
      DomServiceModule.name,
      Html2canvasServiceModule.name,
    ])
    .config(($routeProvider: angular.ui.IUrlRouterProvider) => {
      $routeProvider.otherwise(
          {
            controller: PreviewAppCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'src/render/preview-app.ng',
          });
    });
