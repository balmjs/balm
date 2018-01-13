import merge from 'webpack-merge';
import { isArray } from '../helpers';

const LOADERS = require('require-dir')('../loaders');

function* loaderEntries(obj) {
  for (let key of Object.keys(obj)) {
    yield obj[key].default;
  }
}

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
    rules: config.scripts.loaders
  }
);

config.scripts.loaders = output.rules;
