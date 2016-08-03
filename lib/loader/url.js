export default {
  test: /\.(png|jpe?g|gif|svg|woff2?)$/,
  loader: 'url',
  query: {
    name: config.production ? '[hash].[ext]' : '[path][name].[ext]?[hash]',
    limit: 10000
  }
};
