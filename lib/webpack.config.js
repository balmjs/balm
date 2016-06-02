import path from 'path';
import webpack from 'webpack';

const webpackConfig = () => {
  let configuration = {
    entry: config.scripts.entry,
    output: {
      path: config.tmp.js,
      filename: '[name].js'
        //chunkFilename: '[chunkhash].js'
    },
    module: {
      loaders: [
        // required to write "require('./style.css')"
        {
          test: /\.css$/,
          loader: 'style!css'
        },
        // required for iconfont
        {
          test: /\.woff$/,
          loader: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff'
        }, {
          test: /\.ttf$/,
          loader: 'file-loader?prefix=font/'
        }, {
          test: /\.eot$/,
          loader: 'file-loader?prefix=font/'
        }, {
          test: /\.svg$/,
          loader: 'file-loader?prefix=font/'
        },
        // required for ES6
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel'
        }
        // required for JSX
        // {
        //   test: /\.jsx$/,
        //   loader: 'jsx-loader?insertPragma=React.DOM'
        // }
      ]
    },
    resolve: {
      modulesDirectories: [
        config.app.css,
        config.app.js,
        // 'node_modules',
        'bower_components'
      ]
    },
    resolveLoader: {
      modulesDirectories: [
        path.join(__dirname, '..', 'node_modules')
      ]
    },
    plugins: [
      new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
      )
    ]
  };

  if (config.production) {
    configuration.plugins.push(new webpack.optimize.DedupePlugin());
    configuration.plugins.push(new webpack.optimize.UglifyJsPlugin());
  } else {
    configuration.debug = true;
    configuration.devtool = 'sourcemap';
  }

  return configuration;
};

export default webpackConfig;
