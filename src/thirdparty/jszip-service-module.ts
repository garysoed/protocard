import ThirdpartyProvider from './thirdparty-provider';

export default angular
    .module('pc.thirdparty.JszipServiceModule', [])
    .provider('JszipService', ThirdpartyProvider('JSZip'));
