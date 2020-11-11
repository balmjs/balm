const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

function resolve(dir) {
  return path.join(__dirname, '..', '..', dir);
}

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
    '@': resolve('vue-ssr/app/scripts'),
    vue$: 'vue/dist/vue.esm.js'
  },
  plugins: [new VueLoaderPlugin()],
  lint: false,
  options: {
    compress: {
      drop_console: false
    }
  }
};
