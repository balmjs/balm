const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const base = require('./base');
const balm = require('../balm');
let balmConfig = require('../balmrc');

const scripts = Object.assign(base, {
  entry: {
    lib: ['vue', 'vue-router', 'vuex', 'axios'],
    client: './vue-ssr/app/scripts/entry-client.js'
  }
});

balmConfig = Object.assign(balmConfig, {
  server: {
    open: false,
    proxyContext: '/api',
    proxyOptions: {
      target: 'http://localhost:8088',
      changeOrigin: true
    },
    historyOptions: {
      index: '/server.html' // NOTE: entry template
    }
  },
  roots: {
    source: 'vue-ssr/app'
  },
  scripts
});

if (balm.config.isProd) {
  // This plugins generates `vue-ssr-client-manifest.json` in the
  // output directory.
  balmConfig.scripts.plugins = balmConfig.scripts.plugins.concat([
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': '"client"'
    }),
    new VueSSRClientPlugin()
  ]);
  balmConfig.scripts.inject = true;
}

balm.config = balmConfig;

if (balm.config.isProd) {
  balm.config.html.options.removeComments = false;
  balm.config.cache = true;
}

balm.go(mix => {
  if (balm.config.isProd) {
    mix.copy('vue-ssr/data/*', 'dist/data');
  }
});
