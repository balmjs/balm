const { VueLoaderPlugin } = require('vue-loader');
const env = require('../env');
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
    plugins: [new VueLoaderPlugin()],
    alias: {
      '@': env.resolve('vue2/scripts'),
      vue$: 'vue/dist/vue.esm.js'
    },
    injectHtml: true,
    htmlPluginOptions: {
      template: 'vue2/templates/auto.html'
    }
    // extractCss: true
  }
});
