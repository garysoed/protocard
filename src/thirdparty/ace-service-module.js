import ThirdpartyProvider from './thirdparty-provider';

export default angular
    .module('pc.thirdparty.AceServiceModule', [])
    .provider('AceService', ThirdpartyProvider('ace'));
