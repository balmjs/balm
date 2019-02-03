// From BalmUI
import getType from './typeof';

const isString = str => getType(str) === 'string';

const isObject = obj => getType(obj) === 'object';

const isArray = arr => Array.isArray(arr);

const isFunction = fn => {
  let type = getType(fn);
  return type === 'function' || type === 'generatorfunction';
};

// Deep merge two objects.
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

const toNamespace = taskName => {
  let result;

  if (isString(taskName)) {
    result = `${BalmJS.NAMESPACE}:${taskName}`;
  } else if (isArray(taskName)) {
    result = taskName.map(name => `${BalmJS.NAMESPACE}:${name}`);
  } else {
    logger.error('[Task Namespace] The task name must be a string or array');
  }

  return result;
};

export { isString, isObject, isArray, isFunction, mergeDeep, toNamespace };
