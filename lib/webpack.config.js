import webpack from 'webpack';

const HOT_RELOAD = 'webpack-hot-middleware/client?noInfo=true&reload=true';

const webpackConfig = (input = '', output = '') => {
  let webpackEntries = input || {};
  if (!input) {
    for (let key in config.scripts.entry) {
      let value = config.scripts.entry[key];
      let isVendor = config.scripts.vendors.indexOf(key) > -1;
      let entryKey = isVendor ? path.join('vendor', key) : path.join(key);
      let entryValue = !config.production ? (typeof value === 'string' ? [value, HOT_RELOAD] : [...value, HOT_RELOAD]) : value;

      webpackEntries[entryKey] = entryValue;
    }
  }

  let configuration = {
    entry: webpackEntries,
    output: {
      path: output || path.join(__dirname, '..', '..', '..', config.tmp.js),
      publicPath: config.scripts.publicPath,
      filename: config.scripts.filename,
      chunkFilename: config.scripts.chunkFilename
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
        '',
        '.webpack.js',
        '.web.js',
        '.js',
        '.jsx',
        '.json',
        ...config.scripts.extensions
      ],
      modulesDirectories: [
        'node_modules',
        'bower_components',
        config.source.css,
        config.source.js
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
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
      ),
      // 优化排序
      new webpack.optimize.OccurenceOrderPlugin(),
      ...(!config.production ? [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('development')
          }
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
      ] : [
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
      ]),
      ...(config.scripts.vendors.length ?
        config.scripts.vendors.map(vendor => {
          return new webpack.optimize.CommonsChunkPlugin({
            name: path.join('vendor', vendor),
            filename: config.scripts.filename
          });
        }) : []),
      ...config.scripts.plugins
    ],
    debug: config.debug,
    devtool: !config.production ?
      '#eval-source-map' :
      (config.cache ? '#hidden-source-map' : '#source-map')
  };

  for (let key of Object.keys(config.scripts.extends)) {
    configuration[key] = config.scripts.extends[key];
  }

  return configuration;
};

export default webpackConfig;
