const { VueLoaderPlugin } = require('vue-loader');
const env = require('../env');

module.exports = {
  loaders: [
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    },
    {
      test: /\.less$/,
      use: [
        'vue-style-loader',
        {
          loader: require.resolve('css-loader'),
          options: {
            esModule: false
          }
        },
        'less-loader'
      ]
    }
  ],
  defaultLoaders: {
    css: false
  },
  alias: {
    '@': env.resolve('vue2-ssr/app/scripts'),
    vue$: 'vue/dist/vue.esm.js'
  },
  plugins: [new VueLoaderPlugin()],
  lint: false,
  minifyOptions: {
    compress: {
      drop_console: false
    }
  }
};
