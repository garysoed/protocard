/**
 * @fileoverview Provides Fuse.js as a service.
 */

import ThirdpartyProvider from './thirdparty-provider';

export default angular
    .module('thirdparty.FuseServiceModule', [])
    .provider('FuseService', ThirdpartyProvider('Fuse'));
