import AceServiceProvider from './ace-service-provider';

export default angular
    .module('pc.thirdparty.AceServiceModule', [])
    .provider('AceService', AceServiceProvider);
