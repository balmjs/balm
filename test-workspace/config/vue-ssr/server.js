const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const base = require('./base');
const balmrc = require('../balmrc');

const scripts = Object.assign(base, {
  entry: {
    server: './vue-ssr/app/scripts/entry-server.js'
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
    allowlist: /\.css$/
  })
});

const balmConfig = Object.assign(balmrc, {
  roots: {
    source: 'vue-ssr/app'
  },
  scripts,
  logs: {
    level: 2
  }
});

// This is the plugin that turns the entire output of the server build
// into a single JSON file. The default file name will be
// `vue-ssr-server-bundle.json`
balmConfig.scripts.plugins = balmConfig.scripts.plugins.concat([
  new webpack.DefinePlugin({
    'process.env.VUE_ENV': '"server"'
  }),
  new VueSSRServerPlugin()
]);

console.log('server config', balmConfig);

module.exports = balmConfig;
