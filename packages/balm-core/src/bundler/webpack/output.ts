import { ASYNC_SCRIPTS, HASH_NAME, MP_ASSETS } from '../../config/constants';

function getOutput(output: string, scripts: any, isHook = false): any {
  const outputPath: string = output || BalmJS.config.dest.base; // Absolute path
  const jsFolder: string = BalmJS.config.paths.target.js;

  let filename = '[name]';
  let chunkFilename = '[id]';
  if (BalmJS.config.env.isProd) {
    if (BalmJS.config.assets.cache || scripts.inject) {
      filename = `[name].${HASH_NAME}`;
      chunkFilename = `[name].${HASH_NAME}`;
    } else {
      filename = '[name].bundle';
      chunkFilename = '[name].chunk';
    }
  }
  const jsFilename = `${filename}.js`;
  const jsChunkFilename = `${chunkFilename}.js`;

  const customLibraryConfig: object = scripts.library
    ? // webpack@5 syntax
      // {
      //   library: {
      //     type: scripts.libraryTarget,
      //     name: scripts.library
      //   }
      // }
      {
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
