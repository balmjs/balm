class Loader {
  constructor() {
    const loaders = require('require-dir')('./loader');

    for (let name in loaders) {
      let loader = loaders[name].default;
      config.scripts.loaders.push(loader);
    }
  }
}

export default Loader;
