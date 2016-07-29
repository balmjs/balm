class Loaders {
  constructor() {
    const loaders = require('require-dir')('./loader');

    function* entries(obj) {
      for (let key of Object.keys(obj)) {
        yield obj[key].default;
      }
    }

    for (let loader of entries(loaders)) {
      config.scripts.loaders.push(loader); // TODO: duplicate removal
    }
  }
}

export default Loaders;
