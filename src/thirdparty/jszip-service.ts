import ThirdpartyProvider from './thirdparty-provider';

export default angular
    .module('thirdparty.JszipServiceModule', [])
    .provider('JszipService', ThirdpartyProvider('JSZip'));
