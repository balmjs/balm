// From BalmUI.helpers
import getType from './typeof';

const isString = str => getType(str) === 'string';

const isObject = obj => getType(obj) === 'object';

const isArray = arr => getType(arr) === 'array';

const isFunction = fn => getType(fn) === 'function';

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
          Object.assign(target, { [key]: {} });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }
  return target;
};

export { isString, isObject, isArray, isFunction, mergeDeep };
