import merge from 'webpack-merge';
import getEntry from './entry';
import getOutput from './output';
import getDefaultConfig from './config';
import { BalmEntryObject, Configuration } from '@balm-core/index';

function webpackConfig(
  input: string | string[] | BalmEntryObject,
  output: string,
  customWebpackOptions: Configuration = {},
  isHook = false
): Configuration {
  const scripts = BalmJS.config.scripts;
  const defaultEntry = `./${BalmJS.file.defaultEntry}`;

  const baseConfig: any = {
    entry: input ? getEntry(input, scripts) : defaultEntry,
    output: getOutput(output, scripts, isHook)
  };

  BalmJS.logger.debug(
    'webpack bundler',
    {
      input: baseConfig.entry,
      output: baseConfig.output.path
    },
    {
      pre: true
    }
  );

  if (scripts.externals) {
    baseConfig.externals = scripts.externals;
  }

  const defaultConfig = getDefaultConfig(scripts);

  const configuration: Configuration = merge(
    baseConfig,
    defaultConfig,
    scripts.webpackOptions,
    customWebpackOptions
  );

  BalmJS.logger.success('webpack configuration', configuration, {
    pre: true
  });

  return configuration;
}

export default webpackConfig;
