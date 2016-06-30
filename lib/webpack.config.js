import webpack from 'webpack';

const webpackConfig = (input = '', output = '') => {
  let webpackEntries = input || {};
  if (!input) {
    for (let key in config.scripts.entry) {
      let value = config.scripts.entry[key];
      let isVendor = config.scripts.vendors.indexOf(key) > -1;

      webpackEntries[!isVendor ?
          path.join(config.paths.tmp.js, key) :
          path.join(config.paths.tmp.js, 'vendor', key)
        ] = !config.production ?
        (!isVendor ? [
          value,
          'webpack-hot-middleware/client?noInfo=true&reload=true'
        ] : value) :
        value;
    }
  }

  let configuration = {
    entry: webpackEntries,
    output: {
      path: output || path.join(__dirname, '..', '..', '..', config.roots.tmp),
      publicPath: config.scripts.publicPath,
      filename: config.scripts.filename
        //chunkFilename: '[chunkhash].js'
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
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: config.debug ? true : false
          }
        }),
        // new webpack.optimize.AggressiveMergingPlugin()
      ]),
      ...(config.scripts.vendors.length ?
        config.scripts.vendors.map(vendor => {
          return new webpack.optimize.CommonsChunkPlugin({
            name: path.join(config.paths.tmp.js, 'vendor', vendor),
            filename: config.scripts.filename
          });
        }) : []),
      ...config.scripts.plugins
    ],
    debug: config.debug,
    devtool: !config.production ? '#eval-source-map' : '#source-map'
  };

  for (let key of Object.keys(config.scripts.extends)) {
    configuration[key] = config.scripts.extends[key];
  }

  return configuration;
};

export default webpackConfig;
