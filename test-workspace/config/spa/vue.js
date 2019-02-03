import VueLoaderPlugin from 'vue-loader/lib/plugin';

export default {
  entry: {
    main: './src/scripts/main.js'
  },
  loaders: [
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    }
  ],
  plugins: [new VueLoaderPlugin()],
  alias: {
    vue$: 'vue/dist/vue.esm.js'
  }
};
