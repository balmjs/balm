import merge from 'webpack-merge';
import getEntry from './entry';
import getOutput from './output';
import getDefaultConfig from './config';
import { BalmEntryObject, Configuration } from '@balm-core/index';

function webpackConfig(
  input: string | string[] | BalmEntryObject,
  output: string,
  customOptions: any = {},
  isHook = false
): Configuration {
  const scripts: any = BalmJS.config.scripts;
  const defaultEntry = `./${BalmJS.file.defaultEntry}`;

  const baseConfig: any = {
    entry: input ? getEntry(input, scripts) : defaultEntry,
    output: getOutput(output, scripts, isHook)
  };

  if (scripts.externals) {
    baseConfig.externals = scripts.externals;
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
