class Loaders {
  constructor() {
    const loaders = require('require-dir')('./loader');

    function* entries(obj) {
      for (let key of Object.keys(obj)) {
        yield obj[key].default;
      }
    }

    for (let loader of entries(loaders)) {
      if (Array.isArray(loader)) {
        config.scripts.loaders = config.scripts.loaders.concat(loader);
      } else {
        config.scripts.loaders.push(loader);
      }
    }
  }
}

export default Loaders;
