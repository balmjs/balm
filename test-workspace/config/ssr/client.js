const balm = require('../../../dist'); // from local
// const balm = require('balm'); // from node_modules
const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const base = require('./base');
let balmConfig = require('../balmrc');

balmConfig.server.historyOptions = true;
balmConfig.scripts = Object.assign(base, {
  entry: {
    lib: ['vue', 'vue-router', 'axios'],
    client: './ssr/entry-client.js'
  }
});
// This plugins generates `vue-ssr-client-manifest.json` in the
// output directory.
balmConfig.scripts.plugins = balmConfig.scripts.plugins.concat([
  new webpack.DefinePlugin({
    'process.env.VUE_ENV': '"client"'
  }),
  new VueSSRClientPlugin()
]);
balmConfig.scripts.alias['create-api'] = './create-api-client.js';

balm.config = balmConfig;
balm.config.html.options.removeComments = false;

balm.go(mix => {
  if (balm.config.isProd) {
    mix.copy('src/data/*', 'dist/data');
  }
});
