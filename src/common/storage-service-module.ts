import StorageService from './storage-service';

export default angular
    .module('pc.common.StorageServiceModule', [])
    .service('StorageService', ($window: Window) => {
      return new StorageService($window, 'pc');
    });
