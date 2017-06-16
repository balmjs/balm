let vendors = config.scripts.vendors;
let options = {
  names: vendors.map(vendor => path.join(config.scripts.vendorName, vendor)).reverse(),
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
  ...(vendors.length
    ? [new webpack.optimize.CommonsChunkPlugin(options)]
    : [])
];

export default basePlugins;
