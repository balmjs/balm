let options = {
  names: config.scripts.vendors.map(vendor => path.join('vendor', vendor)).reverse(),
  minChunks: Infinity
};

let basePlugins = [
  new webpack.LoaderOptionsPlugin({
    debug: config.debug,
    minimize: config.production,
    options: {
      context: __dirname
    }
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  // For custom vendors
  ...(config.scripts.vendors.length
    ? [new webpack.optimize.CommonsChunkPlugin(options)]
    : [])
];

export default basePlugins;
