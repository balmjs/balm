import { jsRegex, htmlRegex } from '../config/regex.js';
import { RuleSetRule } from '@balm-core/index';

function fileLoader(): RuleSetRule {
  // "file" loader makes sure those assets get served by WebpackDevServer.
  // When you `import` an asset, you get its (virtual) filename.
  // In production, they would get copied to the `build` folder.
  // This loader doesn't use a "test" so it will catch all modules
  // that fall through the other loaders.
  return {
    // Exclude `js` files to keep "css" loader working as it injects
    // its runtime that would otherwise be processed through "file" loader.
    // Also exclude `html` and `json` extensions so they get processed
    // by webpacks internal loaders.
    exclude: [/^$/, jsRegex, htmlRegex, /\.json$/],
    type: 'asset/resource'
  };
  // ** STOP ** Are you adding a new loader?
  // Make sure to add the new loader(s) before the "file" loader.
}

export default fileLoader;
