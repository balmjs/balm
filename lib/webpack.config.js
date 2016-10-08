import {
  isString,
  assetsPath,
  postcssProcessor
} from './helper';

const HOT_RELOAD = 'webpack-hot-middleware/client?noInfo=true&reload=true';

// relative path
const getEntry = input => {
  let webpackEntries = input || {};

  if (!input) {
    for (let key of Object.keys(config.scripts.entry)) {
      let value = config.scripts.entry[key];
      let isVendor = config.scripts.vendors.indexOf(key) > -1;
      // key
      let entryKey = isVendor ?
        path.join('vendor', key) :
        path.join(key);
      // value
      let hotValue = isString(value) ? [value, HOT_RELOAD] : [...value, HOT_RELOAD];
      let entryValue = (!config.production && config.scripts.HMR) ?
        hotValue :
        value;
      // result
      webpackEntries[entryKey] = entryValue;
    }
  }

  BalmJS.log('JS entry', webpackEntries);

  return webpackEntries;
};

// absolute path
const getOutputPath = output => {
  let outputPath = config.production ? config.target.base : config.tmp.base;

  if (output) {
    outputPath = path.join(config.workspace, output);
  }

  return outputPath;
};

const webpackConfig = (input = '', output = '') => {
  let sourceMap = config.scripts.sourceMap ? '#source-map' : false;
  let jsFolder = config.paths.target.js;
  let jsFilename = config.scripts.filename + '.js';
  let jsChunkFilename = config.scripts.chunkFilename + '.js';

  let configuration = {
    context: config.workspace,
    entry: getEntry(input),
    output: {
      path: getOutputPath(output),
      publicPath: config.scripts.publicPath,
      filename: input ? jsFilename : assetsPath(jsFolder + '/' + jsFilename),
      chunkFilename: input ? jsChunkFilename : assetsPath(jsFolder + '/' + jsChunkFilename)
    },
    module: {
      loaders: config.scripts.loaders
    },
    resolve: {
      extensions: [
        // original default
        '',
        '.webpack.js',
        '.web.js',
        '.js',
        // new default
        '.json',
        '.jsx',
        '.vue',
        ...config.scripts.extensions
      ],
      modulesDirectories: [
        // original default
        'web_modules',
        'node_modules',
        // new default
        'bower_components',
        config.paths.source.css,
        config.paths.source.js
      ],
      alias: config.scripts.alias
    },
    resolveLoader: {
      modulesDirectories: [
        path.join(__dirname, '..', 'node_modules'), // for npm2
        path.join(__dirname, '..', '..') // for npm3
      ]
    },
    plugins: require('./plugin/index').default,
    debug: config.debug,
    devtool: config.production ? sourceMap : '#eval-source-map'
  };

  configuration.postcss = () => {
    return postcssProcessor();
  };

  for (let key of Object.keys(config.scripts.extends)) {
    configuration[key] = config.scripts.extends[key];
  }

  return configuration;
};

export default webpackConfig;
