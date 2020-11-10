const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const balmrc = require('../balmrc');

module.exports = Object.assign(balmrc, {
  roots: {
    source: 'vue'
  },
  scripts: {
    entry: {
      main: './vue/scripts/main.js'
    },
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ],
    urlLoaderOptions: {
      esModule: false
    },
    plugins: [new VueLoaderPlugin()],
    alias: {
      '@': path.resolve(__dirname, '..', '..', 'vue', 'scripts'),
      vue$: 'vue/dist/vue.esm.js'
    }
  }
});
