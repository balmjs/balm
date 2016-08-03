export default {
  test: /\.(eot|ttf|wav|mp3)$/,
  loader: 'file',
  query: {
    name: config.production ? '[hash].[ext]' : '[path][name].[ext]?[hash]'
  }
};
