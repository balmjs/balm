export default [{
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  loader: 'url',
  query: {
    limit: 10000,
    name: config.production ? '[name].[hash:7].[ext]' : '[path][name].[ext]?[hash]'
  }
}, {
  test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
  loader: 'url',
  query: {
    limit: 10000,
    name: config.production ? '[name].[hash:7].[ext]' : '[path][name].[ext]?[hash]'
  }
}];
