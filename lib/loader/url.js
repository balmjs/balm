export default [{
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  loader: 'url',
  query: {
    limit: 10000,
    name: config.paths.target.img + '/[name].[hash:7].[ext]'
  }
}, {
  test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
  loader: 'url',
  query: {
    limit: 10000,
    name: config.paths.target.font + '/[name].[hash:7].[ext]'
  }
}];
