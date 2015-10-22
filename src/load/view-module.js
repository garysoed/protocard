import ViewCtrl from './view-ctrl';

export default angular
    .module('load.ViewModule', ['ngRoute'])
    .config($routeProvider => {
      $routeProvider.when(
          '/load/:assetId',
          {
            controller: ViewCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'load/view.ng'
          });
    });
