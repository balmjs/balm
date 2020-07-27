import { RuleSetRule } from '@balm/index';

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
    test: /\.html$/i,
    loader: 'html-loader',
    options
  };
}

export default htmlLoader;
