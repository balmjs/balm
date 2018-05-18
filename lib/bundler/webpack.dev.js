import getCommonConfig from './webpack.common';
import merge from 'webpack-merge';

const getDevConfig = options => {
  return merge(getCommonConfig(options), {
    mode: 'development',
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development')
        }
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
      new webpack.NoEmitOnErrorsPlugin()
    ],
    devtool: 'cheap-module-eval-source-map'
  });
};

export default getDevConfig;
