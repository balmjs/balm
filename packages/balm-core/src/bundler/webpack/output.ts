import { CHUNK, ASSET } from '../../config/constants.js';
import { LooseObject, BalmScripts } from '@balm-core/index';

function getJsFilename(scripts: BalmScripts, isChunk = false): string {
  let filename: string;

  if (isChunk) {
    filename = BalmJS.config.env.isProd ? `[name].${CHUNK.hash}` : '[name]';
  } else {
    filename = scripts.useCache ? `[name].${CHUNK.hash}` : '[name]';
  }

  return `${filename}.js`;
}

function getOutput(
  output: string,
  scripts: BalmScripts,
  isHook = false
): LooseObject {
  const outputDirectory: string = output || BalmJS.config.dest.base;
  const jsFolder: string = BalmJS.config.paths.target.js;
  const bundleFilename = getJsFilename(scripts);
  const chunkFilename = getJsFilename(scripts, true);

  const customLibraryConfig: object = scripts.library
    ? { library: scripts.library }
    : {};

  const miniprogramConfig: object = BalmJS.config.env.isMP
    ? {
        path: BalmJS.file.absPath(
          node.path.join(BalmJS.config.dest.base, ASSET.mpDir)
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
      path: BalmJS.file.absPath(outputDirectory),
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: isHook
        ? bundleFilename
        : BalmJS.file.assetsPath(`${jsFolder}/${bundleFilename}`),
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isHook
        ? chunkFilename
        : BalmJS.file.assetsPath(`${jsFolder}/${CHUNK.dir}/${chunkFilename}`),
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
