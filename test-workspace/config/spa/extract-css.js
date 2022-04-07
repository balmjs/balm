const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    'css-a': './spa/scripts/css-page-a.js',
    'css-b': './spa/scripts/css-page-b.js'
  },
  injectHtml: true,
  htmlPluginOptions: {
    title: ['Page 1', 'Page 2']
  },
  defaultLoaders: {
    css: false
  },
  loaders: [
    {
      test: /\.css$/i,
      use: [MiniCssExtractPlugin.loader, 'css-loader']
    }
  ],
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'asset/[name].[contenthash:8].css',
      chunkFilename: 'asset/[name].[contenthash:8].css'
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        aStyles: {
          type: 'css/mini-extract',
          name: 'css-a',
          chunks: (chunk) => chunk.name === 'css-a',
          enforce: true
        },
        bStyles: {
          type: 'css/mini-extract',
          name: 'css-b',
          chunks: (chunk) => chunk.name === 'css-b',
          enforce: true
        }
      }
    }
  }
  // extractCss: true
};
