import webpack from 'webpack';

const webpackConfig = () => {
  return {
    debug: true,
    devtool: 'sourcemap',
    entry: config.webpack.entry,
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
        },
        // required for JSX
        {
          test: /\.jsx$/,
          loader: 'jsx-loader?insertPragma=React.DOM'
        }
      ]
    },
    resolve: {
      modulesDirectories: [
        config.app.css,
        config.app.js,
        'bower_components'
      ]
    },
    plugins: [
      new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
      ),
      new webpack.optimize.DedupePlugin()
    ]
  };
};

export default webpackConfig;
