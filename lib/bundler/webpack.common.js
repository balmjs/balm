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
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules|bower_components[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};

export default webpackConfig;
