import webpack from 'webpack';

const webpackConfig = (input = '', output = '') => {
  let webpackEntries = input || {};
  if (!input) {
    for (let key in config.scripts.entry) {
      let value = config.scripts.entry[key];
      webpackEntries[path.join(config.paths.tmp.js, key)] = config.production ?
        value : [
          value,
          'webpack-hot-middleware/client?noInfo=true&reload=true'
        ];
    }
  }

  let resolveExtensions = ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'].concat(config.scripts.extensions);

  let configuration = {
    entry: webpackEntries,
    output: {
      path: output || path.join(__dirname, '..', '..', '..', config.tmp.base),
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
      extensions: resolveExtensions,
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
      )
    ]
  };

  if (config.production) {
    configuration.devtool = '#source-map';
    configuration.plugins = configuration.plugins.concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin()
      // use gulp-uglify
      // new webpack.optimize.UglifyJsPlugin({
      //   compress: {
      //     warnings: config.debug ? true : false
      //   }
      // })
    ]);
  } else {
    configuration.debug = true;
    // eval-source-map is faster for development
    configuration.devtool = '#eval-source-map';
    configuration.plugins = configuration.plugins.concat([
      // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]);
  }

  return configuration;
};

export default webpackConfig;
