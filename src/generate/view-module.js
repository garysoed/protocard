import ViewCtrl from './view-ctrl';
import PreviewModule from './preview-module';

export default angular
    .module('pc.generate.ViewModule', ['ngRoute', PreviewModule.name])
    .config($routeProvider => {
      $routeProvider.when(
          '/generate',
          {
            controller: ViewCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'generate/view.ng'
          });
    });
