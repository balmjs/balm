export default {
  test: /\.(png|jpe?g|gif|svg)$/,
  loader: 'url?limit=10000&name=[path][name].[ext]?[hash]'
};
