module.exports = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
  // new webpack.optimize.LimitChunkCountPlugin({
  //   maxChunks: 15
  // }),
  // new webpack.optimize.MinChunkSizePlugin({
  //   minChunkSize: 10000
  // }),
  new webpack.optimize.AggressiveMergingPlugin(),
  // split vendor js into its own file
  ...(config.scripts.vendor ? [new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: (module, count) => {
      BalmJS.log(module, count);
      // any required modules inside node_modules/bower_components are extracted to vendor
      return (
        module.resource &&
        /\.js$/.test(module.resource) &&
        (module.resource.indexOf(path.join(config.workspace, 'node_modules')) === 0 ||
          module.resource.indexOf(path.join(config.workspace, 'bower_components')) === 0)
      );
    }
  })] : [])
];
