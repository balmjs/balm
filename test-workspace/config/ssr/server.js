var VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
var base = require('./base');

var config = Object.assign(base, {
  entry: {
    // lib: ['vue', 'vue-router', 'vuex', 'axios'],
    'server-bundle': './src/scripts/entry-server.js'
  },
  // This allows webpack to handle dynamic imports in a Node-appropriate
  // fashion, and also tells `vue-loader` to emit server-oriented code when
  // compiling Vue components.
  target: 'node',
  // This tells the server bundle to use Node-style exports
  libraryTarget: 'commonjs2',
  // This is the plugin that turns the entire output of the server build
  // into a single JSON file. The default file name will be
  // `vue-ssr-server-bundle.json`
  plugins: [new VueSSRServerPlugin()]
});

module.exports = config;
