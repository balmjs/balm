import { ASYNC_SCRIPTS, INJECT_HASHNAME, MP_ASSETS } from '../config/constants';

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
    `Path: ${BalmJS.file.absPath(
      BalmJS.config.env.isMP
        ? path.join(BalmJS.config.dest.base, MP_ASSETS)
        : outputPath
    )}`
  );

  const customLibraryConfig: object = scripts.library
    ? {
        library: scripts.library,
        libraryTarget: scripts.libraryTarget
      }
    : {};

  const miniprogramConfig: object = BalmJS.config.env.isMP
    ? {
        path: BalmJS.file.absPath(
          path.join(BalmJS.config.dest.base, MP_ASSETS)
        ),
        library: 'createApp',
        libraryExport: 'default',
        libraryTarget: 'window'
      }
    : customLibraryConfig;

  return Object.assign(
    {
      path: BalmJS.file.absPath(outputPath),
      filename: isHook
        ? jsFilename
        : BalmJS.file.assetsPath(`${jsFolder}/${jsFilename}`),
      publicPath: BalmJS.file.publicPath,
      chunkFilename: isHook
        ? jsChunkFilename
        : BalmJS.file.assetsPath(
            `${jsFolder}/${ASYNC_SCRIPTS}/${jsChunkFilename}`
          )
    },
    miniprogramConfig
  );
}

export default getOutput;
