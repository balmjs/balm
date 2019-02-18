const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  loaders: [
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    }
  ],
  plugins: [new VueLoaderPlugin()],
  eslint: false,
  options: {
    compress: {
      drop_console: false
    }
  }
};
