const isVendorModule = resource => {
  let belongsToNode = resource.indexOf(File.absPaths('node_modules')) === 0;
  let belongsToBower =
    resource.indexOf(File.absPaths('bower_components')) === 0;

  return belongsToNode || belongsToBower;
};

let options = {
  name: config.scripts.vendorName,
  minChunks: (module, count) => {
    logger.info(module, count);
    // Any required modules inside node_modules/bower_components are extracted to vendor
    return (
      module.resource &&
      /\.js$/.test(module.resource) &&
      isVendorModule(module.resource)
    );
  }
};

let productionPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  // Webpack 3 - Scope Hoisting
  new webpack.optimize.ModuleConcatenationPlugin(),
  // NOTE: use `webpack-parallel-uglify-plugin`
  new webpack.optimize.UglifyJsPlugin(
    Object.assign(config.scripts.options, {
      sourceMap: config.scripts.sourceMap
    })
  ),
  // Keep module.id stable when vender modules does not change
  new webpack.HashedModuleIdsPlugin(),
  // Split vendor js into its own file
  ...(config.scripts.vendor && !config.scripts.vendors.length
    ? [new webpack.optimize.CommonsChunkPlugin(options)]
    : [])
];

export default productionPlugins;
