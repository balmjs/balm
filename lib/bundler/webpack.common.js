let vendors = config.scripts.vendors;
let sourceMap = config.scripts.sourceMap ? '#source-map' : false;

let cacheGroups = false;

if (config.scripts.extractAllVendors) {
  cacheGroups = {
    default: {
      minChunks: 2,
      priority: -20,
      reuseExistingChunk: true
    },
    vendors: {
      test: /[\\/]node_modules|bower_components[\\/]/,
      priority: -10,
      name: config.scripts.vendorName,
      chunks: 'all'
    }
  };
}

if (vendors.length) {
  cacheGroups = {};
  vendors.forEach(vendor => {
    let name = vendor.key;
    let reg = vendor.value.join('|');
    cacheGroups[name] = {
      test: new RegExp(`[\\\\/]${reg}[\\\\/]`),
      name: path.join(config.scripts.vendorName, name),
      chunks: 'initial'
    };
  });
}

// Logger.info('[Cache Groups]', cacheGroups);

const webpackConfig = {
  context: config.workspace,
  module: {
    strictExportPresence: true,
    rules: config.scripts.loaders
  },
  resolve: {
    // (was split into `root`, `modulesDirectories` and `fallback` in the old options)
    // In which folders the resolver look for modules
    // relative paths are looked up in every parent folder (like node_modules)
    // absolute paths are looked up directly
    // the order is respected
    modules: [config.source.base, 'node_modules', 'bower_components'],
    // These extensions are tried when resolving a file
    extensions: [
      '.wasm',
      '.mjs',
      '.js',
      '.json',
      '.jsx',
      '.vue',
      ...config.scripts.extensions
    ],
    // These aliasing is used when trying to resolve a module
    alias: config.scripts.alias,
    // These JSON files are read in directories
    descriptionFiles: ['package.json', 'bower.json'],
    // These fields in the description files are looked up when trying to resolve the package directory
    mainFields: ['main', 'browser'],
    // These files are tried when trying to resolve a directory
    mainFiles: ['index'],
    // These fields in the description files offer aliasing in this package
    // The content of these fields is an object where requests to a key are mapped to the corresponding value
    aliasFields: ['browser'],
    // If false it will also try to use no extension from above
    enforceExtension: false,
    // If false it's also try to use no module extension from above
    enforceModuleExtension: false
  },
  resolveLoader: {
    // These extensions are tried when resolving a module
    moduleExtensions: ['-loader']
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: config.debug,
      minimize: config.production,
      options: {
        context: __dirname
      }
    }),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  devtool: config.production ? sourceMap : '#cheap-module-eval-source-map',
  target: config.scripts.target,
  node: {
    // Prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // Prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  stats: config.scripts.stats,
  optimization: {
    occurrenceOrder: true,
    splitChunks: cacheGroups ? { cacheGroups } : false
  }
};

export default webpackConfig;
