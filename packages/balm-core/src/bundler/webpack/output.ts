import { ASYNC_SCRIPTS, HASH_NAME, MP_ASSETS } from '../../config/constants';

function getOutput(output: string, scripts: any, isHook = false): any {
  const outputPath: string = output || BalmJS.config.dest.base; // Absolute path
  const jsFolder: string = BalmJS.config.paths.target.js;

  let chunkFilename = '[id]';
  if (BalmJS.config.env.isProd) {
    if (BalmJS.config.assets.cache || scripts.inject) {
      chunkFilename = `[name].${HASH_NAME}`;
    } else {
      chunkFilename = '[name]';
    }
  }
  const jsChunkFilename = `${chunkFilename}.js`;
  const jsFilename: string = scripts.inject
    ? `[name].${HASH_NAME}.js`
    : '[name].js';

  const customLibraryConfig: object = scripts.library
    ? {
        // TODO: webpack@5 `libraryTarget` has bug, https://github.com/webpack/webpack/issues/11632
        libraryTarget: scripts.libraryTarget,
        library: scripts.library
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
    : {};

  return Object.assign(
    {
      path: BalmJS.file.absPath(outputPath),
      filename: isHook
        ? jsFilename
        : BalmJS.file.assetsPath(`${jsFolder}/${jsFilename}`),
      publicPath: BalmJS.file.publicUrlOrPath,
      chunkFilename: isHook
        ? jsChunkFilename
        : BalmJS.file.assetsPath(
            `${jsFolder}/${ASYNC_SCRIPTS}/${jsChunkFilename}`
          )
    },
    customLibraryConfig,
    miniprogramConfig
  );
}

export default getOutput;
