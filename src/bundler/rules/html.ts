import { RuleSetRule } from '@balm/index';

function htmlLoader(): RuleSetRule {
  const options = Object.assign(
    {
      minimize: {
        removeAttributeQuotes: false
      }
    },
    BalmJS.config.scripts.htmlLoaderOptions
  );

  return {
    test: /\.html$/i,
    loader: 'html-loader',
    options
  };
}

export default htmlLoader;
