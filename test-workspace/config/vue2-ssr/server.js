const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const base = require('./base');
const balmrc = require('../balmrc');

const scripts = Object.assign(base, {
  entry: {
    server: './vue2-ssr/app/scripts/entry-server.js'
  },
  // This allows webpack to handle dynamic imports in a Node-appropriate
  // fashion, and also tells `vue-loader` to emit server-oriented code when
  // compiling Vue components.
  target: 'node',
  // This tells the server bundle to use Node-style exports
  library: {
    // note there's no `name` here
    type: 'commonjs2'
  },
  // https://webpack.js.org/configuration/externals/#externals
  // https://github.com/liady/webpack-node-externals
  externals: [
    nodeExternals({
      // do not externalize CSS files in case we need to import it from a dep
      allowlist: [/\.css$/]
    })
  ],
  webpackOptions: {
    externalsPresets: { node: true } // in order to ignore built-in modules like path, fs, etc.
  }
});

const balmConfig = Object.assign(balmrc, {
  roots: {
    source: 'vue2-ssr/app'
  },
  scripts
});

// This is the plugin that turns the entire output of the server build
// into a single JSON file. The default file name will be
// `vue-ssr-server-bundle.json`
balmConfig.scripts.plugins = balmConfig.scripts.plugins.concat([
  new VueSSRServerPlugin()
]);
balmConfig.scripts.nodeEnv = {
  VUE_ENV: 'server'
};

// console.log('server config', balmConfig);

module.exports = balmConfig;
