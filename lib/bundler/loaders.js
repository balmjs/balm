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

const getLoaders = loaders => {
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

  let result = merge.smart(
    {
      rules: defaultLoaders
    },
    {
      rules: loaders
    }
  );

  return result.rules;
};

export default getLoaders;
