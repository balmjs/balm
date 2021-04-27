import { ASYNC_SCRIPTS, HASH_NAME, MP_ASSETS } from '../../config/constants';
import { WebpackOutput, BalmScripts } from '@balm-core/index';

function getFilename(scripts: BalmScripts, isChunk = false): string {
  let filename: string;

  if (isChunk) {
    filename = BalmJS.config.env.isProd
      ? BalmJS.config.assets.cache || scripts.useCache
        ? `[name].${HASH_NAME}`
        : '[name]'
      : '[id]';
  } else {
    filename = scripts.useCache ? `[name].${HASH_NAME}` : '[name]';
  }

  return `${filename}.js`;
}

function getOutput(
  output: string,
  scripts: BalmScripts,
  isHook = false
): WebpackOutput {
  const outputPath = output || BalmJS.config.dest.base; // Absolute path
  const jsFolder = BalmJS.config.paths.target.js;
  const jsFilename = getFilename(scripts);
  const jsChunkFilename = getFilename(scripts, true);

  const customLibraryConfig: object = scripts.library
    ? { library: scripts.library }
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
          ),
      libraryTarget: scripts.libraryTarget
    },
    customLibraryConfig,
    miniprogramConfig
  );
}

export default getOutput;
