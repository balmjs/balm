import merge from 'webpack-merge';
import requireDir from 'require-dir';

const LOADERS = requireDir('./rules');

function getLoaders(customLoaders: any[]): any[] {
  let defaultLoaders: any[] = [];

  console.log(Object.values(LOADERS));

  Object.values(LOADERS).forEach(function(Loader: any) {
    if (Loader) {
      const loader = Loader();
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

  if (BalmJS.config.logs.level === BalmJS.LogLevel.Debug) {
    BalmJS.logger.info('<webpack loaders>', result.rules);
  }

  return result.rules;
}

export default getLoaders;
