"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enabled = false;
var manifest = 'manifest.json'; // 'manifest.json' or 'manifest.webmanifest'
var workboxSw = 'node_modules/workbox-sw/build/workbox-sw.js';
var mode = 'generateSW'; // 'generateSW' or 'injectManifest'
/**
 * Workbox Build options
 *
 * @reference https://developers.google.com/web/tools/workbox/modules/workbox-build#full_generatesw_config
 * @reference https://developers.google.com/web/tools/workbox/modules/workbox-build#full_injectmanifest_config
 */
var options = {};
var swSrcFilename = 'service-worker.js';
var swDestFilename = 'sw.js';
exports.default = {
    enabled: enabled,
    manifest: manifest,
    workboxSw: workboxSw,
    mode: mode,
    options: options,
    swSrcFilename: swSrcFilename,
    swDestFilename: swDestFilename
};
