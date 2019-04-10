import merge from 'webpack-merge';
import getCommonConfig from './webpack.common';

const getDevConfig = options => {
  return merge(getCommonConfig(options), {
    mode: 'development',
    plugins: [
      // This is necessary to emit hot updates
      new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'cheap-module-eval-source-map'
  });
};

export default getDevConfig;
