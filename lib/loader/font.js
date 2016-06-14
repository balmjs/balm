export default {
  test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
  loader: 'url',
  query: {
    limit: 10000,
    name: '[path][name].[ext]?[hash]'
  }
};
