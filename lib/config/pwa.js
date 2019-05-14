const PWA_CONFIG = {
  enabled: false,
  workboxSw: 'node_modules/workbox-sw/build/workbox-sw.js',
  mode: 'generateSW', // 'generateSW' or 'injectManifest'
  options: {}
};

export default PWA_CONFIG;
