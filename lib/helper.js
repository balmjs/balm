// From BalmUI helpers

const getType = any => Object.prototype.toString.call(any).replace(/\[object\s(.*)\]/, '$1').toLowerCase();

const isString = str => getType(str) === 'string';

const isObject = obj => getType(obj) === 'object';

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
