import commonConfig from './webpack.common';
import merge from 'webpack-merge';
import UglifyJsWebpackPlugin from 'uglifyjs-webpack-plugin';

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

const webpackConfig = merge(commonConfig, {
  mode: 'production',
  optimization
});

export default webpackConfig;
