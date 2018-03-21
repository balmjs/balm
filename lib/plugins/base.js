// Let vendors = config.scripts.vendors;
// let options = {
//   names: vendors
//     .map(vendor => path.join(config.scripts.vendorName, vendor))
//     .reverse(),
//   minChunks: Infinity
// };

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
  // ...(vendors.length ? [new webpack.optimize.CommonsChunkPlugin(options)] : []),
  // Moment.js is an extremely popular library that bundles large locale files
  // by default due to how Webpack interprets its code. This is a practical
  // solution that requires the user to opt into importing specific locales.
  // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
  // You can remove this if you don't use Moment.js:
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
];

export default basePlugins;
