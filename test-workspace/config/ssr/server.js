var balm = require('../../../dist/main'); // from local
// var balm = require('balm'); // from node_modules
var nodeExternals = require('webpack-node-externals');
var VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
var balmConfig = require('./balmrc');
var base = require('./base');

balmConfig.ssr = true;
balmConfig.scripts = Object.assign(base, {
  entry: {
    'server-bundle': './src/scripts/entry-server.js'
  },
  // This allows webpack to handle dynamic imports in a Node-appropriate
  // fashion, and also tells `vue-loader` to emit server-oriented code when
  // compiling Vue components.
  target: 'node',
  // This tells the server bundle to use Node-style exports
  libraryTarget: 'commonjs2',
  // https://webpack.js.org/configuration/externals/#externals
  // https://github.com/liady/webpack-node-externals
  externals: nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    whitelist: /\.css$/
  }),
  // This is the plugin that turns the entire output of the server build
  // into a single JSON file. The default file name will be
  // `vue-ssr-server-bundle.json`
  plugins: [new VueSSRServerPlugin()]
});

balm.config = balmConfig;

balm.go();

var config = balm.getWebpackConfig();

module.exports = config;
