import { ASYNC_SCRIPTS, INJECT_HASHNAME } from '../config/constants';

function getOutput(output: string, scripts: any, isHook = false): any {
  const outputPath: string = output || BalmJS.config.dest.base; // Absolute path
  const jsFolder: string = BalmJS.config.paths.target.js;
  const jsFilename: string = scripts.inject
    ? `[name].${INJECT_HASHNAME}.js`
    : '[name].js';
  let chunkFilename = '[id]';
  if (BalmJS.config.env.isProd) {
    if (scripts.inject) {
      chunkFilename = `[name].${INJECT_HASHNAME}`;
    } else if (BalmJS.config.assets.cache) {
      chunkFilename = '[name].[chunkhash:8]';
    } else {
      chunkFilename = '[name].chunk';
    }
  }
  const jsChunkFilename = `${chunkFilename}.js`;

  BalmJS.logger.debug(
    'webpack output',
    `Path: ${BalmJS.file.absPath(outputPath)}`
  );

  return {
    path: BalmJS.file.absPath(outputPath),
    filename: isHook
      ? jsFilename
      : BalmJS.file.assetsPath(`${jsFolder}/${jsFilename}`),
    publicPath: BalmJS.file.publicPath,
    library: scripts.library,
    libraryTarget: scripts.libraryTarget,
    chunkFilename: isHook
      ? jsChunkFilename
      : BalmJS.file.assetsPath(
          `${jsFolder}/${ASYNC_SCRIPTS}/${jsChunkFilename}`
        )
  };
}

export default getOutput;
