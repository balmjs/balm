import merge from 'webpack-merge';
import getEntry from './entry';
import getOutputPath from './output';
import { ASYNC_SCRIPTS, INJECT_HASHNAME } from '../config/constants';
import getDevConfig from './webpack.dev';
import getProdConfig from './webpack.prod';

const webpackConfig = (input = '', output = '') => {
  let options = config.scripts;

  let customCompile = input;
  let jsFolder = config.paths.target.js;
  let jsFilename = config.scripts.inject
    ? `[name].${INJECT_HASHNAME}.js`
    : '[name].js';

  let chunkFilename = '[id]';
  if (config.isProd) {
    if (config.scripts.inject) {
      chunkFilename = `[name].${INJECT_HASHNAME}`;
    } else if (config.cache) {
      chunkFilename = '[name].[chunkhash:8]';
    } else {
      chunkFilename = '[name].chunk';
    }
  }

  let jsChunkFilename = `${chunkFilename}.js`;

  let baseConfiguration = {
    entry: getEntry(input, options),
    output: {
      path: getOutputPath(output),
      filename: customCompile
        ? jsFilename
        : BalmFile.assetsPath(`${jsFolder}/${jsFilename}`),
      publicPath: BalmFile.getPublicPath(),
      library: options.library,
      libraryTarget: options.libraryTarget,
      chunkFilename: customCompile
        ? jsChunkFilename
        : BalmFile.assetsPath(`${jsFolder}/${ASYNC_SCRIPTS}/${jsChunkFilename}`)
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
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    };
  }

  let defaultConfiguration = config.isProd
    ? getProdConfig(options)
    : getDevConfig(options);

  let configuration = merge(
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
