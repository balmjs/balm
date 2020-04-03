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
  return getType(fn) === 'function';
}

// Deep merge two objects
function deepMerge(target: any, source: any): any {
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(function (key: string) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }

        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }

  return target;
}

export default {
  getType,
  isString,
  isObject,
  isArray,
  isFunction,
  deepMerge
};
