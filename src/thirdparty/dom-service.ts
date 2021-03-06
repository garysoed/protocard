/**
 * @fileoverview Provides various DOM global objects as services.
 */

import ThirdpartyProvider from './thirdparty-provider';

export default angular
    .module('thirdparty.DomServiceModule', [])
    .provider('DOMParserService', ThirdpartyProvider('DOMParser'));
