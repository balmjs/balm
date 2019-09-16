import { ASYNC_SCRIPTS, INJECT_HASHNAME } from '../config/constants';

function getOutput(
  scripts: any,
  input?: string | string[] | { [entryChunkName: string]: string | string[] },
  output?: string
): any {
  const customCompile = input;
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
    path: output ? BalmJS.file.absPaths(output) : BalmJS.config.dest.base, // Absolute path
    filename: customCompile
      ? jsFilename
      : BalmJS.file.assetsPath(`${jsFolder}/${jsFilename}`),
    publicPath: BalmJS.file.getPublicPath(),
    library: scripts.library,
    libraryTarget: scripts.libraryTarget,
    chunkFilename: customCompile
      ? jsChunkFilename
      : BalmJS.file.assetsPath(
          `${jsFolder}/${ASYNC_SCRIPTS}/${jsChunkFilename}`
        )
  };
}

export default getOutput;
