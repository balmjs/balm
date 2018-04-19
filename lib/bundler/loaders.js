import merge from 'webpack-merge';
import { isArray } from '../utilities';

const LOADERS = require('require-dir')('../bundler/rules');

function* loaderEntries(obj) {
  for (let key of Object.keys(obj)) {
    if (obj[key].default) {
      yield obj[key].default();
    }
  }
}

const getLoaders = options => {
  let defaultLoaders = [];

  for (let loader of loaderEntries(LOADERS)) {
    if (loader) {
      if (isArray(loader)) {
        defaultLoaders = defaultLoaders.concat(loader);
      } else {
        defaultLoaders.push(loader);
      }
    }
  }

  const result = merge.smart(
    {
      rules: defaultLoaders
    },
    {
      rules: options.loaders
    }
  );

  return result.rules;
};

export default getLoaders;
