let options = {
  names: config.scripts.vendors.map(vendor => path.join('vendor', vendor)).reverse(),
  minChunks: Infinity
};

let basePlugins = [
  new webpack.LoaderOptionsPlugin({
    options: {
      context: __dirname
    },
    debug: config.debug
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  // For custom vendors
  ...(config.scripts.vendors.length
    ? [new webpack.optimize.CommonsChunkPlugin(options)]
    : [])
];

export default basePlugins;
