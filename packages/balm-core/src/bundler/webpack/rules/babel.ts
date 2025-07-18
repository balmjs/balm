import { jsRegex } from '../config/regex.js';
import { RuleSetRule } from '@balm-core/index';
import { SWCWebpackLoader } from '../loaders/swc-loader.js';

function jsLoader(): RuleSetRule {
  // Check if SWC should be used instead of Babel
  const shouldUseSWC = BalmJS.config.compiler?.type === 'swc' || 
                       BalmJS.config.scripts.useSWC === true;

  if (shouldUseSWC) {
    try {
      // Use SWC loader if available and configured
      return SWCWebpackLoader.getLoaderRule(BalmJS.config, {
        test: jsRegex,
        include: [
          BalmJS.file.absPaths(BalmJS.config.src.js),
          ...BalmJS.config.scripts.includeJsResource
        ],
      });
    } catch (error) {
      // Fall back to Babel if SWC is not available
      BalmJS.logger.warn('js-loader', 'SWC not available, falling back to Babel');
    }
  }

  // Default Babel loader
  const options = Object.assign(
    {
      // This is a feature of `babel-loader` for webpack (not Babel itself).
      // It enables caching results in ./node_modules/.cache/babel-loader/
      // directory for faster rebuilds.
      cacheDirectory: true
    },
    BalmJS.config.scripts.babelLoaderOptions
  );

  // Process application JS with Babel.
  // The preset includes JSX, Flow, TypeScript, and some ESnext features.
  return {
    test: jsRegex,
    include: [
      BalmJS.file.absPaths(BalmJS.config.src.js),
      ...BalmJS.config.scripts.includeJsResource
    ],
    loader: requireModule.resolve('babel-loader'),
    options
  };
}

export default jsLoader;
