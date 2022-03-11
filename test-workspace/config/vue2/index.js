const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
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
  styles: {
    extname: 'scss'
  },
  scripts: {
    entry: {
      lib: ['vue'],
      ui: ['balm-ui'],
      main: './vue2/scripts/main.js'
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
      '@': path.resolve(__dirname, '..', '..', 'vue2', 'scripts'),
      vue$: 'vue/dist/vue.esm.js'
    },
    injectHtml: true,
    htmlPluginOptions: {
      template: 'vue2/templates/auto.html'
    },
    extractCss: true
  }
});
