import Service from './asset-service';
import StorageServiceModule from '../common/storage-service-module';

export default angular
    .module('pc.data.AssetServiceModule', [
      StorageServiceModule.name
    ])
    .service('AssetService', Service);
