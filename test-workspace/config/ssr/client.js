const balm = require('../../../dist'); // from local
// const balm = require('balm'); // from node_modules
const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const base = require('./base');
let balmConfig = require('../balmrc');

balmConfig.server = {
  open: false,
  proxyContext: '/api',
  proxyOptions: {
    target: 'http://localhost:8088',
    changeOrigin: true
  },
  historyOptions: {
    index: '/server.html' // NOTE: entry template
  }
};

balmConfig.scripts = Object.assign(base, {
  entry: {
    lib: ['vue', 'vue-router', 'vuex', 'axios'],
    client: './ssr/entry-client.js'
  }
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
}

balm.config = balmConfig;

if (balm.config.isProd) {
  balm.config.html.options.removeComments = false;
  balm.config.cache = true;
}

balm.go(mix => {
  if (balm.config.isProd) {
    mix.copy('src/data/*', 'dist/data');
  }
});
