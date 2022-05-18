import { mergeWithRules, CustomizeRule } from 'webpack-merge';
import LOADERS from './rules/index.js';
import fileLoader from './rules/file.js';
import { RuleSetRule, BalmLoaders } from '@balm-core/index';

function getLoaders(customLoaders: RuleSetRule[]): RuleSetRule[] {
  const enableDefaultLoaders: BalmLoaders = Object.assign(
    {
      js: true,
      css: true,
      html: true,
      asset: true
    },
    BalmJS.config.scripts.defaultLoaders
  );
  const useDefaultLoaders: boolean = Object.values(enableDefaultLoaders).some(
    (value) => value
  );

  let defaultLoaders: RuleSetRule[] = [];
  if (useDefaultLoaders) {
    Object.values(LOADERS).forEach((Loader: Function) => {
      const key = Loader.name.replace('Loader', '') as
        | 'js'
        | 'css'
        | 'html'
        | 'asset';
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
    },
    {
      module: {
        rules: [fileLoader()]
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
