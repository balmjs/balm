import webpack from 'webpack';
import {
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
        let entryKey = isVendor ? path.join('vendor', key) : path.join(key);
        // value
        let hotValue = (typeof value === 'string') ? [value, HOT_RELOAD] : [...value, HOT_RELOAD];
        let entryValue = (!config.production && config.scripts.HMR) ? hotValue : value;
        // result
        webpackEntries[entryKey] = entryValue;
      }
    }
  }

  let sourceMap = config.cache ? '#hidden-source-map' : '#source-map';
  let jsFolder = config.paths.target.js;
  let jsFilename = config.scripts.filename + '.js';
  let jsChunkFilename = config.scripts.chunkFilename + '.js';

  if (config.debug) {
    $.util.log('entry:', webpackEntries);
  }

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
    plugins: [
      new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main'])
      ),
      // 优化排序
      new webpack.optimize.OccurenceOrderPlugin(),
      ...(config.production ? [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production')
          }
        }),
        // 去重
        new webpack.optimize.DedupePlugin(),
        // 最小化
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: config.debug
          }
        }),
        // 优化chunks传输
        // new webpack.optimize.LimitChunkCountPlugin({
        //   maxChunks: 15
        // }),
        // new webpack.optimize.MinChunkSizePlugin({
        //   minChunkSize: 10000
        // }),
        new webpack.optimize.AggressiveMergingPlugin()
      ] : [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('development')
          }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
      ]),
      // split vendor js into its own file
      ...(config.scripts.vendor ? [new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: (module, count) => {
          if (config.debug) {
            $.util.log(module, count);
          }
          // any required modules inside node_modules are extracted to vendor
          return (
            module.resource &&
            /\.js$/.test(module.resource) &&
            (module.resource.indexOf(path.join(config.workspace, 'node_modules')) === 0 ||
              module.resource.indexOf(path.join(config.workspace, 'bower_components')) === 0)
          );
        }
      })] : []),
      // for custom vendors
      ...(config.scripts.vendors.length ? [new webpack.optimize.CommonsChunkPlugin({
        names: config.scripts.vendors.map(vendor => path.join('vendor', vendor)).reverse(),
        minChunks: Infinity
      })] : []),
      // for others
      ...config.scripts.plugins
    ],
    debug: config.debug,
    devtool: config.production ? sourceMap : '#eval-source-map'
  };

  for (let key of Object.keys(config.scripts.extends)) {
    configuration[key] = config.scripts.extends[key];
  }

  return configuration;
};

export default webpackConfig;
