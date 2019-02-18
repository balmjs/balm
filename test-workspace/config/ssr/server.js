const balm = require('../../../dist'); // from local
// const balm = require('balm'); // from node_modules
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const base = require('./base');
let balmConfig = require('../balmrc');

balmConfig.scripts = Object.assign(base, {
  entry: {
    server: './src/scripts/entry-server.js'
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
  })
});
// This is the plugin that turns the entire output of the server build
// into a single JSON file. The default file name will be
// `vue-ssr-server-bundle.json`
balmConfig.scripts.plugins.concat([
  new webpack.DefinePlugin({
    'process.env.VUE_ENV': '"server"'
  }),
  new VueSSRServerPlugin()
]);

balm.config = balmConfig;

balm.go();
