import merge from 'webpack-merge';
import { isArray } from '../utilities';

const LOADERS = require('require-dir')('../bundler/rules');

function* loaderEntries(obj) {
  for (let key of Object.keys(obj)) {
    yield obj[key].default;
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

  const output = merge.smart(
    {
      rules: defaultLoaders
    },
    {
      rules: options.loaders
    }
  );

  return output.rules;
};

export default getLoaders;
