import { merge } from 'webpack-merge';
import getCommonConfig from './common.js';
import { LooseObject, Configuration, BalmScripts } from '@balm-core/index';

function getDevConfig(
  webpack: LooseObject,
  scripts: BalmScripts
): Configuration {
  return merge(getCommonConfig(webpack, scripts), {
    mode: 'development',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        )
      }),
      // This is necessary to emit hot updates
      new webpack.HotModuleReplacementPlugin()
    ],
    devtool: scripts.sourceMap
      ? (scripts.sourceMap as string)
      : 'eval-cheap-module-source-map'
  });
}

export default getDevConfig;
