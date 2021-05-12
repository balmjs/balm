import { ASYNC_SCRIPTS, HASH_NAME, MP_ASSETS } from '../../config/constants.js';
import { BalmScripts } from '@balm-core/index';

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

function getOutput(output: string, scripts: BalmScripts, isHook = false): any {
  const outputPath: string = output || BalmJS.config.dest.base; // Absolute path
  const jsFolder: string = BalmJS.config.paths.target.js;
  const jsFilename = getFilename(scripts);
  const jsChunkFilename = getFilename(scripts, true);

  const customLibraryConfig: object = ['module', 'commonjs2'].includes(
    scripts.libraryTarget
  )
    ? {
        library: {
          type: scripts.libraryTarget
        }
      }
    : {
        library: {
          name: scripts.library || 'MyLibrary',
          type: scripts.libraryTarget
        }
      };

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
