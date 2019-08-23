const balmrc = require('../balmrc');

const balm = balmrc.balm;
let balmConfig = balmrc.balmConfig;

balmConfig = Object.assign(balmConfig, {
  roots: {
    source: 'pwa'
  },
  scripts: {
    entry: {
      main: './pwa/scripts/main.js'
    }
  },
  pwa: {
    enabled: true,
    workboxSw: '../node_modules/workbox-sw/build/workbox-sw.js'
  }
});

balm.config = balmConfig;

balm.go(mix => {
  if (!balm.config.isProd) {
    // mix.copy(
    //   'node_modules/workbox-sw/build/workbox-sw.js',
    //   balm.config.isProd ? balm.config.roots.target : balm.config.roots.tmp
    // );
    // PWA API test
    // mix.generateSW();
    // mix.injectManifest();
  }
});
