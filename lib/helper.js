/**
 * Determines if a reference is a `String`.
 * @param  {Any} str
 * @return {Boolean}
 */
const isString = str => {
  return typeof str === 'string' || str instanceof String;
};

/**
 * Simple is object check.
 * @param   {Any} item
 * @returns {Boolean}
 */
const isObject = item => {
  return item && typeof item === 'object' && !Array.isArray(item) && item !== null;
};

/**
 * Deep merge two objects.
 * @param  {Object} target
 * @param  {Object} source
 * @return {Object}
 */
const mergeDeep = (target, source) => {
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, {[key]: {}});
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, {[key]: source[key]});
      }
    });
  }
  return target;
};

const assetsPath = _path => {
  return config.production
    ? path.posix.join(config.assets.subDir, _path)
    : _path;
};

export {isString, isObject, mergeDeep, assetsPath};
