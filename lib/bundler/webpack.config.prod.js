import merge from 'webpack-merge';
import UglifyJsWebpackPlugin from 'uglifyjs-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import commonConfig from './webpack.common';

const optimization = {
  minimizer: [
    new UglifyJsWebpackPlugin({
      cache: true,
      parallel: true, // Uses all cores available on given machine
      sourceMap: config.scripts.sourceMap,
      uglifyOptions: config.scripts.options
    })
  ]
};

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
      ? [
          new MiniCssExtractPlugin({
            filename: File.assetsPath(
              `${config.paths.target.css}/${config.scripts.extractCss.filename}`
            )
          })
        ]
      : [])
  ],
  devtool: config.scripts.sourceMap ? 'source-map' : false,
  optimization
});

export default webpackConfig;
