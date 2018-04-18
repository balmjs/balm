import { mergeDeep } from '../utilities';

let vendors = config.scripts.vendors;

let cacheGroups = false;

if (config.scripts.extractAllVendors) {
  cacheGroups = {
    vendors: {
      test: /[\\/]node_modules|bower_components[\\/]/,
      chunks: 'all',
      filename: File.assetsPath(
        `${config.paths.target.js}/${config.scripts.vendorName}.js`
      )
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
      chunks: 'initial',
      filename: File.assetsPath(
        path.join(
          config.paths.target.js,
          config.scripts.vendorName,
          `${name}.js`
        )
      )
    };
  });
}

const optimization = mergeDeep(
  {
    occurrenceOrder: true,
    splitChunks: cacheGroups ? { cacheGroups } : false
  },
  config.scripts.optimization
);

let webpackConfig = {
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
    mainFields: ['main', 'browser', 'module']
  },
  resolveLoader: {
    // These extensions are tried when resolving a module
    moduleExtensions: ['-loader']
  },
  plugins: [
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ...config.scripts.plugins
  ],
  target: config.scripts.target,
  stats: config.scripts.stats,
  optimization
};

if (webpackConfig.target === 'web') {
  webpackConfig.node = {
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
  };
}

export default webpackConfig;
