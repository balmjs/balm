const enabled = false;
const workboxSw = 'node_modules/workbox-sw/build/workbox-sw.js';
const mode = 'generateSW'; // 'generateSW' or 'injectManifest'
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
