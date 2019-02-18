const balm = require('../../../dist');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  cssLoader: false,
  loaders: [
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    },
    {
      test: /\.styl(us)?$/,
      use: balm.isProd
        ? ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: { minimize: true }
              },
              'stylus-loader'
            ],
            fallback: 'vue-style-loader'
          })
        : ['vue-style-loader', 'css-loader', 'stylus-loader']
    }
  ],
  alias: {
    public: path.resolve(__dirname, '../../public')
  },
  plugins: [new VueLoaderPlugin()],
  eslint: false,
  options: {
    compress: {
      drop_console: false
    }
  },
  webpack: {
    module: {
      noParse: /es6-promise\.js$/
    }
  }
};
