import VueLoaderPlugin from 'vue-loader/lib/plugin';
import path from 'path';

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
    vue$: 'vue/dist/vue.esm.js',
    '@': path.resolve(__dirname, '..', '..', 'src', 'scripts')
  }
};
