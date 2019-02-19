const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

function resolve(dir) {
  return path.join(__dirname, '..', '..', dir);
}

module.exports = {
  cssLoader: false,
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
  alias: {
    vue$: 'vue/dist/vue.esm.js',
    '@': resolve('src')
  },
  plugins: [new VueLoaderPlugin()],
  eslint: false,
  options: {
    compress: {
      drop_console: false
    }
  }
};
