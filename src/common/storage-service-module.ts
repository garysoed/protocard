import StorageService from './storage-service';

export default angular
    .module('pc.common.StorageServiceModule', [])
    .service('StorageService', function($window) {
      return new StorageService($window, 'pc');
    });
