import merge from 'webpack-merge';
import getEntry from './entry';
import getOutputPath from './output';
import { ASYNC_SCRIPTS } from '../config/constants';
import { mergeDeep } from '../utilities';
import getDevConfig from './webpack.dev';
import getProdConfig from './webpack.prod';

if (config.scripts.cdn) {
  logger.warning(
    '[Scripts]',
    '`scripts.cdn` was removed in balm@0.20.0. Use `server.externals` instead. (See http://balmjs.com/docs/en/configuration/scripts.html)',
    true
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
    }
  };

  if (options.externals) {
    baseConfiguration.externals = options.externals;
  }

  const defaultConfiguration = config.production
    ? getProdConfig(options)
    : getDevConfig(options);

  const configuration = merge(
    baseConfiguration,
    defaultConfiguration,
    options.webpack
  );

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

  logger.log(stats.toString(config.scripts.stats));
};

export { webpackConfig, webpackErrorHandling };
