import { htmlRegex } from '../config/regex.js';
import { RuleSetRule } from '@balm-core/index';

function htmlLoader(): RuleSetRule {
  const options = Object.assign(
    {
      minimize: {
        removeAttributeQuotes: false
      },
      esModule: BalmJS.config.scripts.useEsModule
    },
    BalmJS.config.scripts.htmlLoaderOptions
  );

  return {
    test: `${htmlRegex}i`,
    loader: requireModule.resolve('html-loader'),
    options
  };
}

export default htmlLoader;
