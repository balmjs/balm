import merge from 'webpack-merge';
import { ASYNC_FOLDER, HOT_RELOAD } from './config/constants';
import { isString, isArray } from './helpers';

const FILENAME_REGEX = new RegExp('[^/]+$', 'i');

// Relative path
const getEntry = input => {
  let webpackEntries = input || {};

  if (input) {
    if (isArray(input) && input.length) {
      webpackEntries = {};

      for (let value of input) {
        let matchResult = FILENAME_REGEX.exec(value)[0];
        let key = matchResult.split('.')[0];
        webpackEntries[key] = value;
      }
    }
  } else {
    for (let key of Object.keys(config.scripts.entry)) {
      let value = config.scripts.entry[key];
      let isVendor = config.scripts.vendors.includes(key);
      // Key
      let entryKey = isVendor
        ? path.join(config.scripts.vendorName, key)
        : path.join(key);
      // Value
      let hotValue = isString(value)
        ? [value, HOT_RELOAD]
        : [...value, HOT_RELOAD];
      let entryValue =
        !config.production && config.scripts.hot ? hotValue : value;
      // Result
      webpackEntries[entryKey] = entryValue;
    }
  }

  logger.info('[JS entry]', webpackEntries);

  return webpackEntries;
};

// Absolute path
const getOutputPath = output => {
  let outputPath = config.production ? config.target.base : config.tmp.base;

  if (output) {
    outputPath = File.absPaths(output);
  }

  return outputPath;
};

const webpackConfig = (input = '', output = '') => {
  let sourceMap = config.scripts.sourceMap ? '#source-map' : false;
  let jsFolder = config.paths.target.js;
  let jsFilename = `${config.scripts.filename}.js`;
  let chunkFilename =
    config.production && config.cache ? '[chunkhash]' : '[id]';
  if (config.scripts.chunkFilename) {
    chunkFilename = config.scripts.chunkFilename;
  }
  let jsChunkFilename = `${chunkFilename}.js`;

  let defaultConfiguration = {
    context: config.workspace,
    entry: getEntry(input),
    output: {
      path: getOutputPath(output),
      publicPath: config.assets.publicUrl,
      filename: input
        ? jsFilename
        : File.assetsPath(`${jsFolder}/${jsFilename}`),
      library: config.scripts.library,
      libraryTarget: config.scripts.libraryTarget,
      umdNamedDefine: config.scripts.umdNamedDefine,
      chunkFilename: input
        ? jsChunkFilename
        : File.assetsPath(`${jsFolder}/${ASYNC_FOLDER}/${jsChunkFilename}`)
    },
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
    plugins: require('./plugins/index').default,
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
    stats: config.scripts.stats
  };

  if (config.scripts.cdn) {
    defaultConfiguration.externals = config.scripts.cdn;
  }

  const configuration = merge(defaultConfiguration, config.scripts.webpack);

  return configuration;
};

const webpackErrorHandling = (err, stats) => {
  // Fatal webpack errors (wrong configuration, etc)
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  logger.log(stats.toString(config.scripts.stats));
};

export { webpackConfig, webpackErrorHandling };
