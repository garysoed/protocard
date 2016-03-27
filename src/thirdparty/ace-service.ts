import ThirdpartyProvider from './thirdparty-provider';

export default angular
    .module('thirdparty.AceServiceModule', [])
    .provider('AceService', ThirdpartyProvider('ace'));
