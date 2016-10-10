let options = {
  names: config.scripts.vendors.map(vendor => path.join('vendor', vendor)).reverse(),
  minChunks: Infinity
};

let basePlugins = [
  new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main'])),
  new webpack.optimize.OccurrenceOrderPlugin(),
  // for custom vendors
  ...(config.scripts.vendors.length
    ? [new webpack.optimize.CommonsChunkPlugin(options)]
    : [])
];

export default basePlugins;
