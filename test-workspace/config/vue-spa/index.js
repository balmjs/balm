const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const balm = require('../balm');
const balmrc = require('../balmrc');

const balmConfig = Object.assign(balmrc, {
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
