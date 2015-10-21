import GenerateViewModule from './generate/view-module';

angular
    .module('pc.App', [
      'ngMaterial',
      'ngRoute',
      GenerateViewModule.name
    ])
    .run($location => {
      $location.path('generate');
    });
