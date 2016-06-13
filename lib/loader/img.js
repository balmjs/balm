export default {
  test: /\.(png|jpe?g|gif|svg)$/,
  loader: 'url?limit=10000|file?name=[path][name].[ext]?[hash]'
};
