const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');
const balm = require('../balm');
let balmConfig = require('../balmrc');

balmConfig = Object.assign(balmConfig, {
  roots: {
    source: 'vue-spa'
  },
  scripts: {
    entry: {
      main: './vue-spa/scripts/main.js'
    },
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ],
    plugins: [new VueLoaderPlugin()],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '..', '..', 'vue-spa', 'scripts')
    }
  }
});

balm.config = balmConfig;

balm.go();
