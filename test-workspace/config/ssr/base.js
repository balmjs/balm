module.exports = {
  // entry: {
  //   lib: ['vue', 'vue-router', 'vuex', 'axios']
  // },
  loaders: [
    {
      test: /\.vue$/,
      loader: 'vue'
    }
  ],
  eslint: false,
  options: {
    compress: {
      drop_console: false
    }
  }
};
