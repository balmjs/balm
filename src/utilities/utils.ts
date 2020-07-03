import getType from './typeof';
import { LooseObject } from '@balm/index';

function isString(str: unknown): boolean {
  return getType(str) === 'string';
}

function isObject(obj: unknown): boolean {
  return getType(obj) === 'object';
}

function isArray(arr: unknown): boolean {
  return Array.isArray(arr);
}

function isFunction(fn: unknown): boolean {
  const type = getType(fn);
  return type === 'function' || type === 'generatorfunction';
}

// Deep merge two objects
function deepMerge(target: LooseObject, source: LooseObject): LooseObject {
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key: string) => {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }

        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key] as LooseObject
        });
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
