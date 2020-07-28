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
    test: /\.html$/i,
    loader: require.resolve('html-loader'),
    options
  };
}

export default htmlLoader;
