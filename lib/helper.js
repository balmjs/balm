/**
 * Simple is object check.
 * @param item
 * @returns {boolean}
 */
const isObject = item => {
  return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
};

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
const mergeDeep = (target, source) => {
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, {
          [key]: {}
        });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key]
        });
      }
    });
  }
  return target;
};

const initConfig = () => {
  let defaults = config;
  // overwrite config.paths.tmp
  config = mergeDeep(defaults, {
    paths: {
      tmp: defaults.paths.source
    }
  });
  // create quick dir
  for (let rKey in config.roots) {
    config[rKey] = {};
    for (let pKey in config.paths[rKey]) {
      config[rKey][pKey] = config.roots[rKey] + config.paths[rKey][pKey];
    }
  }
  // set default js
  if (typeof config.scripts.entry === 'undefined') {
    config.scripts.entry = {
      main: './' + config.source.js + '/main.js'
    };
  }

  if (config.debug) {
    console.info('config');
    console.log(config);
  }
};

const getStyleTask = () => {
  let styleTask = (config.styles.ext === 'less') ? 'less' : 'sass';
  return styleTask;
};

export {
  isObject,
  mergeDeep,
  initConfig,
  getStyleTask
};
