import DomServiceModule from '../../thirdparty/dom-service-module';
import Html2canvasServiceModule from '../../thirdparty/html2canvas-service-module';
import PreviewAppCtrl from './preview-app-ctrl';

angular
    .module('pc.PreviewApp', [
      'ngMaterial',
      'ngRoute',
      DomServiceModule.name,
      Html2canvasServiceModule.name
    ])
    .config(($documentProvider, $routeProvider) => {
      $routeProvider.otherwise(
          {
            controller: PreviewAppCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'asset/render/preview-app.ng'
          });
    });
