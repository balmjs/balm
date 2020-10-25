const path = require('path');
const { VueLoaderPlugin } = require('vue-loader-v16');
const balmrc = require('../balmrc');

module.exports = Object.assign(balmrc, {
  roots: {
    source: 'vue3'
  },
  scripts: {
    entry: {
      main: './vue3/scripts/main.js'
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
      '@': path.resolve(__dirname, '..', '..', 'vue-spa', 'scripts'),
      vue$: 'vue/dist/vue.esm-bundler.js'
    }
  }
});
