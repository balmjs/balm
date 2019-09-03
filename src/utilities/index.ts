import getType from './typeof';

namespace Utils {
  export function isString(str: any): boolean {
    return getType(str) === 'string';
  }

  export function isObject(obj: any): boolean {
    return getType(obj) === 'object';
  }

  export function isArray(arr: any): boolean {
    return Array.isArray(arr);
  }

  export function isFunction(fn: any): boolean {
    const type = getType(fn);
    return type === 'function' || type === 'generatorfunction';
  }
}

export = Utils;
