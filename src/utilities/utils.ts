import getType from './typeof';

function isString(str: any): boolean {
  return getType(str) === 'string';
}

function isObject(obj: any): boolean {
  return getType(obj) === 'object';
}

function isArray(arr: any): boolean {
  return Array.isArray(arr);
}

function isFunction(fn: any): boolean {
  const type = getType(fn);
  return type === 'function' || type === 'generatorfunction';
}

// Deep merge two objects
const mergeDeep = (target: any, source: any): object => {
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

export default {
  getType,
  isString,
  isObject,
  isArray,
  isFunction,
  mergeDeep
};
