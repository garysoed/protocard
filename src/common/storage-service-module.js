// TODO(gs): Move some of the parsing and namespacing stuff here.
export default angular
    .module('pc.common.StorageServiceModule', [])
    .constant('StorageService', window.localStorage);
