import {
  isString,
  assetsPath
} from './helper';

const HOT_RELOAD = 'webpack-hot-middleware/client?noInfo=true&reload=true';

const webpackConfig = (input = '', output = '') => {
  let webpackEntries = input || {};

  if (!input) {
    for (let key in config.scripts.entry) {
      if ({}.hasOwnProperty.call(config.scripts.entry, key)) {
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
  }

  let sourceMap = config.cache ? '#hidden-source-map' : '#source-map';
  let jsFolder = config.paths.target.js;
  let jsFilename = config.scripts.filename + '.js';
  let jsChunkFilename = config.scripts.chunkFilename + '.js';

  BalmJS.log('JS entry', webpackEntries);

  let configuration = {
    context: config.workspace,
    entry: webpackEntries,
    output: {
      path: output || (config.production ? config.target.base : config.tmp.base),
      publicPath: config.scripts.publicPath,
      filename: assetsPath(jsFolder + '/' + jsFilename),
      chunkFilename: assetsPath(jsFolder + '/' + jsChunkFilename)
    },
    module: {
      loaders: config.scripts.loaders
    },
    postcss: () => {
      return [
        require('precss')(),
        require('autoprefixer')({
          browsers: config.styles.autoprefixer
        })
      ];
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
    plugins: require('./plugin/index'),
    debug: config.debug,
    devtool: config.production ? sourceMap : '#eval-source-map'
  };

  for (let key of Object.keys(config.scripts.extends)) {
    configuration[key] = config.scripts.extends[key];
  }

  return configuration;
};

export default webpackConfig;
