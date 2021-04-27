const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const balmrc = require('../balmrc');

module.exports = Object.assign(balmrc, {
  roots: {
    source: 'vue'
  },
  paths: {
    source: {
      html: 'templates'
    }
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
    },
    injectHtml: true,
    htmlPluginOptions: {
      template: 'vue/templates/auto.html'
    },
    extractCss: true
  }
});
