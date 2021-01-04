import { jsRegex } from '../config/regex';
import { RuleSetRule } from '@balm-core/index';

function jsLoader(): RuleSetRule {
  const options = Object.assign({}, BalmJS.config.scripts.babelLoaderOptions);

  // Process application JS with Babel.
  // The preset includes JSX, Flow, TypeScript, and some ESnext features.
  return {
    test: jsRegex,
    include: [
      BalmJS.file.absPaths(BalmJS.config.src.js),
      ...BalmJS.config.scripts.includeJsResource
    ],
    loader: require.resolve('babel-loader'),
    options
  };
}

export default jsLoader;
