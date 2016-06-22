export default {
  test: /\.(png|jpe?g|gif|svg|woff2?)$/,
  loader: 'url',
  query: {
    name: !config.production ? '[path][name].[ext]?[hash]' : '[hash].[ext]',
    limit: 10000,
  }
};
