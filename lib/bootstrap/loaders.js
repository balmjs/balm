import { isArray } from '../helpers';

const LOADERS = require('require-dir')('../loaders');

function* loaderEntries(obj) {
  for (let key of Object.keys(obj)) {
    yield obj[key].default;
  }
}

for (let loader of loaderEntries(LOADERS)) {
  if (loader) {
    if (isArray(loader)) {
      config.scripts.loaders = config.scripts.loaders.concat(loader);
    } else {
      config.scripts.loaders.push(loader);
    }
  }
}
