import PreviewAppCtrl from './preview-app-ctrl';

angular
    .module('pc.PreviewApp', [
      'ngMaterial',
      'ngRoute'
    ])
    .config(($documentProvider, $routeProvider) => {
      $routeProvider.otherwise(
          {
            controller: PreviewAppCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'generate/preview-app.ng'
          });
    });
