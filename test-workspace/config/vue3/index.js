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
    alias: Object.assign(
      {
        '@': path.resolve(__dirname, '..', '..', 'vue3', 'scripts'),
        vue$: 'vue-v3/dist/vue.esm-bundler.js'
      },
      // fix(vue@3.0.1+): __VUE_HMR_RUNTIME__ is not defined in development
      {
        '@vue/runtime-core':
          '@vue/runtime-core/dist/runtime-core.esm-bundler.js'
      }
    )
  }
});
