// var { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  // entry: {
  //   lib: ['vue', 'vue-router', 'vuex', 'axios']
  // },
  loaders: [
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    }
  ],
  plugins: [], // new VueLoaderPlugin()
  eslint: false,
  options: {
    compress: {
      drop_console: false
    }
  }
};
