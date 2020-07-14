import { merge } from 'webpack-merge';
import getCommonConfig from './common';
import { Configuration } from '@balm-core/index';

function getDevConfig(scripts: any): Configuration {
  return merge(getCommonConfig(scripts), {
    mode: 'development',
    plugins: [
      // This is necessary to emit hot updates
      new webpack.HotModuleReplacementPlugin()
    ],
    devtool: scripts.sourceMap || 'cheap-module-eval-source-map'
  });
}

export default getDevConfig;
