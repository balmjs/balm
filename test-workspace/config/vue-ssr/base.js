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
      loader: ['vue-style-loader', 'css-loader', 'less-loader']
    }
  ],
  disableDefaultLoaders: {
    css: true
  },
  alias: {
    vue$: 'vue/dist/vue.esm.js',
    '@': resolve('vue-ssr/app/scripts')
  },
  plugins: [new VueLoaderPlugin()],
  lint: false,
  options: {
    compress: {
      drop_console: false
    }
  }
};
