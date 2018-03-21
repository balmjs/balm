import commonConfig from './webpack.common';
import merge from 'webpack-merge';

const webpackConfig = merge(commonConfig, {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
});

export default webpackConfig;
