import {
  ASYNC_SCRIPTS,
  HASH_NAME_PROD,
  MP_ASSETS
} from '../../config/constants.js';
import { LooseObject, BalmScripts } from '@balm-core/index';

function getFilename(scripts: BalmScripts, isChunk = false): string {
  let filename: string;

  if (isChunk) {
    filename = BalmJS.config.env.isProd ? `[name].${HASH_NAME_PROD}` : '[name]';
  } else {
    filename = scripts.useCache ? `[name].${HASH_NAME_PROD}` : '[name]';
  }

  return `${filename}.js`;
}

function getOutput(
  output: string,
  scripts: BalmScripts,
  isHook = false
): LooseObject {
  const outputPath: string = output || BalmJS.config.dest.base; // Absolute path
  const jsFolder: string = BalmJS.config.paths.target.js;
  const jsFilename = getFilename(scripts);
  const jsChunkFilename = getFilename(scripts, true);

  const customLibraryConfig: object = scripts.library
    ? { library: scripts.library }
    : {};

  const miniprogramConfig: object = BalmJS.config.env.isMP
    ? {
        path: BalmJS.file.absPath(
          node.path.join(BalmJS.config.dest.base, MP_ASSETS)
        ),
        library: {
          name: 'createApp',
          type: 'window',
          export: 'default'
        }
      }
    : {};

  return Object.assign(
    {
      // The build folder.
      path: BalmJS.file.absPath(outputPath),
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: isHook
        ? jsFilename
        : BalmJS.file.assetsPath(`${jsFolder}/${jsFilename}`),
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isHook
        ? jsChunkFilename
        : BalmJS.file.assetsPath(
            `${jsFolder}/${ASYNC_SCRIPTS}/${jsChunkFilename}`
          ),
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: BalmJS.file.publicUrlOrPath
    },
    customLibraryConfig,
    miniprogramConfig
  );
}

export default getOutput;
