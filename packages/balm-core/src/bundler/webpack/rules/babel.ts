import { jsRegex } from '../config/regex.js';
import { RuleSetRule } from '@balm-core/index';

function jsLoader(): RuleSetRule {
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
