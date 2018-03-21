import merge from 'webpack-merge';
import getEntry from './entry';
import getOutputPath from './output';
import { ASYNC_SCRIPTS } from '../config/constants';
const defaultConfiguration = config.production
  ? require('./webpack.config.prod').default
  : require('./webpack.config.dev').default;

const webpackConfig = (input = '', output = '') => {
  let jsFolder = config.paths.target.js;
  let jsFilename = `${config.scripts.filename}.js`;
  let chunkFilename =
    config.production && config.cache ? '[chunkhash]' : '[id]';
  if (config.scripts.chunkFilename) {
    chunkFilename = config.scripts.chunkFilename;
  }
  let jsChunkFilename = `${chunkFilename}.js`;

  let baseConfiguration = {
    entry: getEntry(input),
    output: {
      path: getOutputPath(output),
      publicPath: config.assets.publicUrl,
      filename: input
        ? jsFilename
        : File.assetsPath(`${jsFolder}/${jsFilename}`),
      library: config.scripts.library,
      libraryTarget: config.scripts.libraryTarget,
      umdNamedDefine: config.scripts.umdNamedDefine
      // ChunkFilename: input
      //   ? jsChunkFilename
      //   : File.assetsPath(`${jsFolder}/${ASYNC_SCRIPTS}/${jsChunkFilename}`)
    }
  };

  if (config.scripts.cdn) {
    baseConfiguration.externals = config.scripts.cdn;
  }

  const configuration = merge(
    baseConfiguration,
    defaultConfiguration,
    config.scripts.webpack
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
