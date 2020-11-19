import merge from 'webpack-merge';
import getCommonConfig from './common';
import { Configuration, BalmScripts } from '@balm-core/index';

function getDevConfig(scripts: BalmScripts): Configuration {
  return merge(getCommonConfig(scripts), {
    mode: 'development',
    plugins: [
      // This is necessary to emit hot updates
      new webpack.HotModuleReplacementPlugin()
    ],
    devtool: scripts.sourceMap
      ? (scripts.sourceMap as string)
      : 'eval-cheap-module-source-map'
  });
}

export default getDevConfig;
