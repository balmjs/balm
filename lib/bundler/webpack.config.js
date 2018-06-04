import merge from 'webpack-merge';
import getEntry from './entry';
import getOutputPath from './output';
import { ASYNC_SCRIPTS } from '../config/constants';
import { mergeDeep } from '../utilities';
import getDevConfig from './webpack.dev';
import getProdConfig from './webpack.prod';

if (config.scripts.cdn) {
  logger.warn(
    '[Scripts]',
    '`scripts.cdn` was removed in balm@0.20.0. Use `server.externals` instead. (See https://balmjs.com/docs/en/configuration/scripts.html)'
  );
}

const webpackConfig = (input = '', output = '', extraOptions = {}) => {
  let options = mergeDeep(config.scripts, extraOptions);

  let jsFolder = config.paths.target.js;
  let jsFilename = `${options.filename}.js`;
  let chunkFilename =
    config.production && config.cache ? '[chunkhash]' : '[id]';
  let jsChunkFilename = `${chunkFilename}.js`;

  let baseConfiguration = {
    entry: getEntry(input, options),
    output: {
      path: getOutputPath(output),
      filename: input
        ? jsFilename
        : File.assetsPath(`${jsFolder}/${jsFilename}`),
      publicPath: config.assets.publicUrl,
      library: options.library,
      libraryTarget: options.libraryTarget,
      chunkFilename: input
        ? jsChunkFilename
        : File.assetsPath(`${jsFolder}/${ASYNC_SCRIPTS}/${jsChunkFilename}`)
    },
    target: options.target
  };

  if (options.externals) {
    baseConfiguration.externals = options.externals;
  }

  if (options.target === 'web') {
    baseConfiguration.node = {
      // Prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // Prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    };
  }

  const defaultConfiguration = config.production
    ? getProdConfig(options)
    : getDevConfig(options);

  const configuration = merge(
    baseConfiguration,
    defaultConfiguration,
    options.webpack
  );

  // Debug
  // logger.info('[Webpack Configuration]', configuration);

  return configuration;
};

const webpackErrorHandling = (err, stats) => {
  // Fatal webpack errors (wrong configuration, etc)
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  console.log(stats.toString(config.scripts.stats));
};

export { webpackConfig, webpackErrorHandling };
