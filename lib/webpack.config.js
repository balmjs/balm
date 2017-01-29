import {isString, assetsPath} from './helper';

const HOT_RELOAD = 'webpack-hot-middleware/client?noInfo=true&reload=true';

// relative path
const getEntry = (input) => {
  let webpackEntries = input || {};

  if (!input) {
    for (let key of Object.keys(config.scripts.entry)) {
      let value = config.scripts.entry[key];
      let isVendor = config.scripts.vendors.indexOf(key) > -1;
      // key
      let entryKey = isVendor
        ? path.join('vendor', key)
        : path.join(key);
      // value
      let hotValue = isString(value)
        ? [value, HOT_RELOAD]
        : [
          ...value,
          HOT_RELOAD
        ];
      let entryValue = (!config.production && config.scripts.HMR)
        ? hotValue
        : value;
      // result
      webpackEntries[entryKey] = entryValue;
    }
  }

  logger.info('JS entry', webpackEntries);

  return webpackEntries;
};

// absolute path
const getOutputPath = (output) => {
  let outputPath = config.production
    ? config.target.base
    : config.tmp.base;

  if (output) {
    outputPath = path.join(config.workspace, output);
  }

  return outputPath;
};

const webpackConfig = (input = '', output = '') => {
  let sourceMap = config.scripts.sourceMap
    ? '#source-map'
    : false;
  let jsFolder = config.paths.target.js;
  let jsFilename = `${config.scripts.filename}.js`;
  let jsChunkFilename = `${config.scripts.chunkFilename}.js`;

  let configuration = {
    context: config.workspace,
    entry: getEntry(input),
    output: {
      path: getOutputPath(output),
      publicPath: config.scripts.publicPath,
      filename: input
        ? jsFilename
        : assetsPath(`${jsFolder}/${jsFilename}`),
      chunkFilename: input
        ? jsChunkFilename
        : assetsPath(`${jsFolder}/${jsChunkFilename}`)
    },
    module: {
      rules: config.scripts.loaders
    },
    resolve: {
      // (was split into `root`, `modulesDirectories` and `fallback` in the old options)
      // In which folders the resolver look for modules
      // relative paths are looked up in every parent folder (like node_modules)
      // absolute paths are looked up directly
      // the order is respected
      modules: [
        config.source.base,
        'node_modules',
        'bower_components'
      ],
      // These JSON files are read in directories
      descriptionFiles: [
        'package.json',
        'bower.json'
      ],
      // These fields in the description files are looked up when trying to resolve the package directory
      mainFields: [
        'main',
        'browser'
      ],
      // These files are tried when trying to resolve a directory
      mainFiles: ['index'],
      // These fields in the description files offer aliasing in this package
      // The content of these fields is an object where requests to a key are mapped to the corresponding value
      aliasFields: ['browser'],
      // These extensions are tried when resolving a file
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.vue',
        ...config.scripts.extensions
      ],
      // If false it will also try to use no extension from above
      enforceExtension: false,
      // If false it's also try to use no module extension from above
      enforceModuleExtension: false,
      // These aliasing is used when trying to resolve a module
      alias: config.scripts.alias
    },
    resolveLoader: {
      // These extensions are tried when resolving a module
      moduleExtensions: ['-loader']
    },
    plugins: require('./plugin/index').default,
    devtool: config.production
      ? sourceMap
      : '#eval-source-map'
  };

  for (let key of Object.keys(config.scripts.extends)) {
    configuration[key] = config.scripts.extends[key];
  }

  return configuration;
};

export default webpackConfig;
