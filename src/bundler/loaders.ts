import merge from 'webpack-merge';
import requireDir from 'require-dir';

const LOADERS = requireDir('./rules');

function getLoaders(customLoaders: object[]): object[] {
  const enableDefaultLoaders = Object.assign(
    {
      html: true,
      css: true,
      js: true,
      url: true
    },
    BalmJS.config.scripts.disableDefaultLoaders
  );

  let defaultLoaders: object[] = [];
  Object.values(LOADERS).forEach(function(Loader: any) {
    const key = Loader.name.replace('Loader', '');
    if (enableDefaultLoaders[key]) {
      const loader: object | object[] = Loader();
      if (BalmJS.utils.isArray(loader)) {
        defaultLoaders = defaultLoaders.concat(loader);
      } else {
        defaultLoaders.push(loader);
      }
    }
  });

  const result = merge.smart(
    {
      rules: defaultLoaders
    },
    {
      rules: customLoaders
    }
  );

  BalmJS.logger.info('<webpack loaders>', result.rules, BalmJS.LogLevel.Debug);

  return result.rules;
}

export default getLoaders;
