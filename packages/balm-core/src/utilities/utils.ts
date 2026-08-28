export function isObject(val: any): val is Record<string, any> {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

export function isArray(val: any): val is any[] {
  return Array.isArray(val);
}

export function isString(val: any): val is string {
  return typeof val === 'string';
}

export function isFunction(val: any): val is Function {
  return typeof val === 'function';
}

export function isBoolean(val: any): val is boolean {
  return typeof val === 'boolean';
}

export function deepMerge<T extends Record<string, any>>(target: T, ...sources: any[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else if (isArray(source[key])) {
        (target as any)[key] = [...source[key]];
      } else if (source[key] !== undefined) {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

export function toNamespace(name: string | string[], namespace = 'balm'): string | string[] {
  if (isArray(name)) {
    return name.map((item) => `${namespace}:${item}`);
  }
  return `${namespace}:${name}`;
}
