import { jsRegex } from '../config/regex';
import { RuleSetRule } from '@balm-core/index';

function jsLoader(): RuleSetRule {
  // Process application JS with Babel.
  // The preset includes JSX, Flow, TypeScript, and some ESnext features.
  return {
    test: jsRegex,
    loader: require.resolve('babel-loader'),
    include: [
      BalmJS.file.absPaths(BalmJS.config.src.js),
      ...BalmJS.config.scripts.includeJsResource
    ]
  };
}

export default jsLoader;
