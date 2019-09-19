import merge from 'webpack-merge';
import getEntry from './entry';
import getOutput from './output';
import getDefaultConfig from './config';
import { ObjectEntry } from '../config/types';

function webpackConfig(
  input: string | string[] | ObjectEntry,
  output: string,
  customOptions: any = {},
  isHook = false
): void {
  const scripts = BalmJS.config.scripts;

  const baseConfig: any = {
    entry: getEntry(input, scripts),
    output: getOutput(output, scripts, isHook)
  };

  if (scripts.externals) {
    baseConfig.externals = scripts.externals;
  }

  if (scripts.target === 'web') {
    baseConfig.node = {
      // Prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // Prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    };
  }

  const defaultConfig = getDefaultConfig(scripts);

  const configuration = merge(
    baseConfig,
    defaultConfig,
    scripts.webpackOptions,
    customOptions
  );

  BalmJS.logger.success('<webpack configuration>', configuration);

  return configuration;
}

export default webpackConfig;
