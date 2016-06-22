export default {
  test: /\.(eot|ttf|wav|mp3)$/,
  loader: 'file',
  query: {
    name: !config.production ? '[path][name].[ext]?[hash]' : '[hash].[ext]'
  },
};
