import { mergeWithRules, CustomizeRule } from 'webpack-merge';
import LOADERS from './rules/index.js';
import { RuleSetRule, BalmLoaders } from '@balm-core/index';

function getLoaders(customLoaders: any): RuleSetRule[] {
  const enableDefaultLoaders: BalmLoaders = Object.assign(
    {
      html: true,
      css: true,
      js: true,
      url: true
    },
    BalmJS.config.scripts.defaultLoaders
  );
  const useDefaultLoaders: boolean = Object.values(enableDefaultLoaders).some(
    (value) => value
  );

  let defaultLoaders: RuleSetRule[] = [];
  if (useDefaultLoaders) {
    Object.values(LOADERS).forEach((Loader: any) => {
      const key: 'html' | 'css' | 'js' | 'url' = Loader.name.replace(
        'Loader',
        ''
      );
      if (enableDefaultLoaders[key]) {
        const loader: RuleSetRule | RuleSetRule[] = Loader();
        if (BalmJS.utils.isArray(loader)) {
          defaultLoaders = defaultLoaders.concat(loader);
        } else {
          defaultLoaders.push(loader as RuleSetRule);
        }
      }
    });
  }

  const result = mergeWithRules({
    module: {
      rules: {
        test: CustomizeRule.Match,
        use: {
          loader: CustomizeRule.Match,
          options: CustomizeRule.Replace
        }
      }
    }
  })(
    {
      module: {
        rules: defaultLoaders
      }
    },
    {
      module: {
        rules: customLoaders
      }
    }
  );
  const defaultModule = (result as any).module;

  BalmJS.logger.debug('webpack loaders', defaultModule.rules, {
    pre: true
  });

  return defaultModule.rules;
}

export default getLoaders;
