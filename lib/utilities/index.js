// From BalmUI
import getType from './typeof';

const isString = str => getType(str) === 'string';

const isObject = obj => getType(obj) === 'object';

const isArray = obj => Array.isArray(obj);

const isFunction = fn => {
  let type = getType(fn);
  return type === 'function' || type === 'generatorfunction';
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

const getNamespace = (taskName, namespace = BalmJS.namespace) => {
  let result = taskName;

  if (isString(taskName)) {
    result = `${namespace}:${taskName}`;
  } else if (isArray(taskName)) {
    result = taskName.map(name => `${namespace}:${name}`);
  }

  return result;
};

export { isString, isObject, isArray, isFunction, mergeDeep, getNamespace };
