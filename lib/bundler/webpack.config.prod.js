import merge from 'webpack-merge';
import UglifyJsWebpackPlugin from 'uglifyjs-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import commonConfig from './webpack.common';

const optimization = Object.assign(
  {
    minimizer: [
      new UglifyJsWebpackPlugin({
        cache: true,
        parallel: true, // Uses all cores available on given machine
        sourceMap: config.scripts.sourceMap,
        uglifyOptions: config.scripts.options
      })
    ]
  },
  config.scripts.optimization
);

let extractTextOptions = Object.assign(
  {},
  config.scripts.extractCss.pluginOptions,
  {
    filename: File.assetsPath(config.scripts.extractCss.pluginOptions.filename)
  }
);

const webpackConfig = merge(commonConfig, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    // Keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // Extract css into its own file
    ...(config.scripts.extractCss.enabled
      ? [new ExtractTextPlugin(extractTextOptions)]
      : [])
  ],
  optimization
});

export default webpackConfig;
