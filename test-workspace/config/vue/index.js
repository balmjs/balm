const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader-next');
const balmrc = require('../balmrc');

module.exports = Object.assign(balmrc, {
  roots: {
    source: 'vue'
  },
  styles: {
    extname: 'scss'
  },
  scripts: {
    entry: {
      lib: ['vue'],
      ui: ['balm-ui'],
      main: './vue/scripts/main.js'
    },
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader-next'
      }
    ],
    urlLoaderOptions: {
      esModule: false
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false
      })
    ],
    alias: Object.assign(
      {
        '@': path.resolve(__dirname, '..', '..', 'vue', 'scripts'),
        vue$: 'vue-next/dist/vue.esm-bundler.js'
      }
      // fix(vue@3.0.1+): __VUE_HMR_RUNTIME__ is not defined in development
      // {
      //   '@vue/runtime-core':
      //     '@vue/runtime-core/dist/runtime-core.esm-bundler.js'
      // }
    ),
    injectHtml: true,
    htmlPluginOptions: {
      template: 'vue/templates/auto.html'
    },
    extractCss: true
  }
});
