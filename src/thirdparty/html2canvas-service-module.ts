import ThirdpartyProvider from './thirdparty-provider';

export default angular
    .module('thirdparty.Html2canvasServiceModule', [])
    .provider('Html2canvasService', ThirdpartyProvider('html2canvas'));
