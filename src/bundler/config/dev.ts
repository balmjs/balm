import webpackMerge from 'webpack-merge';
import getCommonConfig from './common';

function getDevConfig(scripts: any): any {
  return webpackMerge(getCommonConfig(scripts), {
    mode: 'development',
    plugins: [
      // This is necessary to emit hot updates
      new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'cheap-module-eval-source-map'
  });
}

export default getDevConfig;
