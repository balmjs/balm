import { merge } from 'webpack-merge';
import getEntry from './entry';
import getOutput from './output';
import getDefaultConfig from './config';
import { BalmEntryObject, Configuration } from '@balm/index';

function webpackConfig(
  input: string | string[] | BalmEntryObject,
  output: string,
  customOptions: any = {},
  isHook = false
): Configuration {
  const scripts: any = BalmJS.config.scripts;
  const defaultEntry = './' + path.join(BalmJS.config.src.js, 'index.js');

  const baseConfig: any = {
    entry: input ? getEntry(input, scripts) : defaultEntry,
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

  const defaultConfig: any = getDefaultConfig(scripts);

  const configuration: Configuration = merge(
    baseConfig,
    defaultConfig,
    scripts.webpackOptions,
    customOptions
  );

  BalmJS.logger.success('webpack configuration', configuration, {
    pre: true
  });

  return configuration;
}

export default webpackConfig;
