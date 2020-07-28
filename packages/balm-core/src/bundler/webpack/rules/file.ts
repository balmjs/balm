import { STATIC_ASSETS } from '../../../config/constants';
import { RuleSetRule } from '@balm-core/index';

function fileLoader(): RuleSetRule {
  const PATHNAME = `${BalmJS.config.paths.target.js}/${STATIC_ASSETS}/`;
  const FILENAME = '[name].[hash:8].[ext]';

  // "file" loader makes sure those assets get served by WebpackDevServer.
  // When you `import` an asset, you get its (virtual) filename.
  // In production, they would get copied to the `build` folder.
  // This loader doesn't use a "test" so it will catch all modules
  // that fall through the other loaders.
  return {
    loader: require.resolve('file-loader'),
    // Exclude `js` files to keep "css" loader working as it injects
    // its runtime that would otherwise be processed through "file" loader.
    // Also exclude `html` and `json` extensions so they get processed
    // by webpacks internal loaders.
    exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
    options: {
      name: BalmJS.file.assetsPath(`${PATHNAME}${FILENAME}`)
    }
  };
}

export default fileLoader;
