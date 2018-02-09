import ExtractTextPlugin from 'extract-text-webpack-plugin';

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

let extractTextOptions = Object.assign(
  {},
  config.scripts.extractCss.pluginOptions,
  {
    filename: File.assetsPath(config.scripts.extractCss.pluginOptions.filename)
  }
);

let productionPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  // NOTE: use `webpack-parallel-uglify-plugin`
  new webpack.optimize.UglifyJsPlugin(
    Object.assign(config.scripts.options, {
      sourceMap: config.scripts.sourceMap
    })
  ),
  // Extract css into its own file
  ...(config.scripts.extractCss.enabled
    ? [new ExtractTextPlugin(extractTextOptions)]
    : []),
  // Keep module.id stable when vendor modules does not change
  new webpack.HashedModuleIdsPlugin(),
  // Enable scope hoisting
  new webpack.optimize.ModuleConcatenationPlugin(),
  // Split vendor js into its own file
  ...(config.scripts.extractAllVendors && !config.scripts.vendors.length
    ? [new webpack.optimize.CommonsChunkPlugin(options)]
    : [])
];

export default productionPlugins;
