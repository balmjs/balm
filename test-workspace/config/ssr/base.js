module.exports = {
  loaders: [
    {
      test: /\.vue$/,
      loader: 'vue'
    }
  ],
  alias: {
    vue$: 'vue/dist/vue.esm.js'
  }
};
