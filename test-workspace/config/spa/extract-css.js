// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'css-a': './spa/scripts/css-page-a.js',
    'css-b': './spa/scripts/css-page-b.js'
  },
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     filename: '[name].html'
  //   })
  // ],
  extractCss: true
};
