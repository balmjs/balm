var VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
var base = require('./base');

var config = Object.assign(base, {
  entry: {
    // lib: ['vue', 'vue-router', 'vuex', 'axios'],
    app: './src/scripts/entry-client.js'
  },
  // This plugins generates `vue-ssr-client-manifest.json` in the
  // output directory.
  plugins: [new VueSSRClientPlugin()]
});

module.exports = config;
