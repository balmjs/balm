const enabled = false;
const workboxSw = 'node_modules/workbox-sw/build/workbox-sw.js';
const mode = 'generateSW'; // 'generateSW' or 'injectManifest'
/**
 * Workbox Build options
 *
 * @reference https://developers.google.com/web/tools/workbox/modules/workbox-build#full_generatesw_config
 * @reference https://developers.google.com/web/tools/workbox/modules/workbox-build#full_injectmanifest_config
 */
const options: object = {};
const swSrcFilename = 'service-worker.js';
const swDestFilename = 'sw.js';

export default {
  enabled,
  workboxSw,
  mode,
  options,
  swSrcFilename,
  swDestFilename
};
