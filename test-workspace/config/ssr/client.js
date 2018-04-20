var balm = require('../../../dist/main'); // from local
// var balm = require('balm'); // from node_modules
var VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
var balmConfig = require('../balmrc');
var base = require('./base');

balmConfig.server.historyOptions = true;
balmConfig.scripts = Object.assign(base, {
  entry: {
    app: './src/scripts/entry-client.js'
  }
});
// This plugins generates `vue-ssr-client-manifest.json` in the
// output directory.
balmConfig.scripts.plugins.push(new VueSSRClientPlugin());

balm.config = balmConfig;

balm.go(function(mix) {
  if (balm.config.production) {
    mix.copy('src/data/*', 'dist/data');
  }
});
