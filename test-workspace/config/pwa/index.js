const balmrc = require('../balmrc');
const pkg = require('../../package.json');

const workboxSw = '../node_modules/workbox-sw/build/workbox-sw.js';
const config = Object.assign(balmrc, {
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
    version: `v${pkg.version.replace(/\./g, '')}`
  }
});

const api = (mix) => {
  if (mix.env.isProd) {
    // mix.copy('./pwa/static/*', './dist/static');
  } else {
    // mix.copy(workboxSw, '.tmp');
    // PWA API test
    // mix.generateSW();
    // mix.injectManifest();
  }
};

module.exports = (balm) => {
  return {
    config,
    api
  };
};
