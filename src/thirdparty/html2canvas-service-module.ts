import ThirdpartyProvider from './thirdparty-provider';

export default angular
    .module('pc.thirdparty.Html2canvasServiceModule', [])
    .provider('Html2canvasService', ThirdpartyProvider('html2canvas'));
