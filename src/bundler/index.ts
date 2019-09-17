import merge from 'webpack-merge';
import getEntry from './entry';
import getOutput from './output';
import getDevConfig from './config/dev';
import getProdConfig from './config/prod';

function webpackConfig(
  input: string | string[] | { [entryChunkName: string]: string | string[] },
  output?: string,
  customOptions: any = {}
): void {
  const scripts = BalmJS.config.scripts;

  const baseConfig: any = {
    entry: getEntry(scripts, input),
    output: getOutput(scripts, input, output),
    target: scripts.target
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

  const defaultConfig = BalmJS.config.env.isProd
    ? getProdConfig(scripts)
    : getDevConfig(scripts);

  const configuration = merge(
    baseConfig,
    defaultConfig,
    scripts.webpackOptions,
    customOptions
  );

  if (BalmJS.config.logs.level === BalmJS.LogLevel.Debug) {
    BalmJS.logger.info('<webpack configuration>', configuration);
  }

  return configuration;
}

export default webpackConfig;
