const balm = require('../balm');
const balmrc = require('../balmrc');
const { version } = require('../../package.json');

const workboxSw = '../node_modules/workbox-sw/build/workbox-sw.js';
const balmConfig = Object.assign(balmrc, {
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
    workboxSw,
    mode: 'injectManifest',
    version: `v${version.replace(/\./g, '')}`
  }
});

balm.config = balmConfig;

balm.go((mix) => {
  if (balm.config.env.isProd) {
    // mix.copy('./pwa/static/*', './dist/static');
  } else {
    // mix.copy(workboxSw, balm.config.roots.tmp);
    // PWA API test
    // mix.generateSW();
    // mix.injectManifest();
  }
});
