import merge from 'webpack-merge';
import requireDir from 'require-dir';
import { RuleSetRule, BalmLoaders } from '@balm-core/index';

const LOADERS = requireDir('./rules');

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
      const DefaultLoader = Loader.default;
      const key: 'html' | 'css' | 'js' | 'url' = DefaultLoader.name.replace(
        'Loader',
        ''
      );
      if (enableDefaultLoaders[key]) {
        const loader: RuleSetRule | RuleSetRule[] = DefaultLoader();
        if (BalmJS.utils.isArray(loader)) {
          defaultLoaders = defaultLoaders.concat(loader);
        } else {
          defaultLoaders.push(loader as RuleSetRule);
        }
      }
    });
  }

  const result = merge(
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
  const defaultModule = result.module as any;

  BalmJS.logger.debug('webpack loaders', defaultModule.rules, {
    pre: true
  });

  return defaultModule.rules;
}

export default getLoaders;
