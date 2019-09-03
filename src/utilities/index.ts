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

const Utils = {
  getType,
  isString,
  isObject,
  isArray,
  isFunction
};

BalmJS.utils = Utils;

export default Utils;
