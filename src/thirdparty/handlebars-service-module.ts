/**
 * @fileoverview Provides Handlebars as a service.
 */

import ThirdpartyProvider from './thirdparty-provider';

export default angular
    .module('thirdparty.HandlebarsServiceModule', [])
    .provider('HandlebarsService', ThirdpartyProvider('Handlebars'));
