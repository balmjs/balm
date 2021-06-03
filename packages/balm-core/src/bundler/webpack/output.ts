import {
  ASYNC_SCRIPTS,
  HASH_NAME_PROD,
  MP_ASSETS
} from '../../config/constants.js';
import getType from '../../utilities/typeof.js';
import { BalmScripts } from '@balm-core/index';

function getFilename(scripts: BalmScripts, isChunk = false): string {
  let filename: string;

  if (isChunk) {
    filename = BalmJS.config.env.isProd ? `[name].${HASH_NAME_PROD}` : '[name]';
  } else {
    filename = BalmJS.useCache ? `[name].${HASH_NAME_PROD}` : '[name]';
  }

  return `${filename}.js`;
}

function getOutput(output: string, scripts: BalmScripts, isHook = false): any {
  const outputPath: string = output || BalmJS.config.dest.base; // Absolute path
  const jsFolder: string = BalmJS.config.paths.target.js;
  const jsFilename = getFilename(scripts);
  const jsChunkFilename = getFilename(scripts, true);

  const customLibraryConfig: object = scripts.library
    ? {
        library: scripts.library
      }
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
