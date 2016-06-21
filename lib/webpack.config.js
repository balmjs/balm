import webpack from 'webpack';

const webpackConfig = () => {
  let resolveExtensions = ['', '.webpack.js', '.web.js', '.js'].concat(config.scripts.extensions);

  let configuration = {
    entry: config.scripts.entry,
    output: {
      path: config.tmp.js,
      // publicPath: '/assets/',
      filename: '[name].js'
        //chunkFilename: '[chunkhash].js'
        //filename: '[name].[hash:5].js'
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
        config.source.css,
        config.source.js,
        path.join(__dirname, '..', '..'),
        path.join(__dirname, '..', '..', '..', 'bower_components')
      ],
      alias: config.scripts.alias
    },
    resolveLoader: {
      modulesDirectories: [
        path.join(__dirname, '..', 'node_modules'),
        path.join(__dirname, '..', '..')
      ]
    },
    plugins: [
      new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
      )
    ]
  };

  if (config.production) {
    let compressWarnings = config.debug ? true : false;

    configuration.plugins.push(new webpack.optimize.DedupePlugin());
    // configuration.plugins.push(new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: compressWarnings
    //   }
    // }));
  } else {
    configuration.debug = true;
    configuration.devtool = '#source-map';
  }

  return configuration;
};

export default webpackConfig;
