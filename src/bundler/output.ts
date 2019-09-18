import { ASYNC_SCRIPTS, INJECT_HASHNAME } from '../config/constants';

function getOutput(output: string, scripts: any, isHook = false): any {
  const outputPath = output || BalmJS.config.dest.base; // Absolute path

  if (BalmJS.config.logs.level === BalmJS.LogLevel.Debug) {
    BalmJS.logger.info(
      '<webpack output path>',
      BalmJS.file.absPaths(outputPath)
    );
  }

  const jsFolder = BalmJS.config.paths.target.js;
  const jsFilename = scripts.inject
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

  return {
    path: BalmJS.file.absPaths(outputPath),
    filename: isHook
      ? jsFilename
      : BalmJS.file.assetsPath(`${jsFolder}/${jsFilename}`),
    publicPath: BalmJS.file.getPublicPath(),
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
