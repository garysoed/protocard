/**
 * @fileoverview Provides Handlebars as a service.
 */

import ThirdpartyProvider from './thirdparty-provider';

export default angular
    .module('pc.thirdparty.HandlebarsServiceModule', [])
    .provider('HandlebarsService', ThirdpartyProvider('Handlebars'));
