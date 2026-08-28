import { TransformFn } from '../pipeline.js';
import { ReplaceOptions } from '../../types/index.js';

export function transformReplace(
  options: ReplaceOptions | ReplaceOptions[] | string | RegExp,
  replacement?: string | ((substring: string, ...args: any[]) => string)
): TransformFn {
  let rules: ReplaceOptions[] = [];

  if (Array.isArray(options)) {
    rules = options;
  } else if (typeof options === 'object' && 'substr' in options) {
    rules = [options];
  } else if (typeof options === 'string' || options instanceof RegExp) {
    rules = [{ substr: options, replacement: replacement || '' }];
  }

  return async (file) => {
    let content = file.toString();
    for (const rule of rules) {
      if (typeof rule.replacement === 'function') {
        content = content.replace(rule.substr, rule.replacement as any);
      } else {
        content = content.replace(rule.substr, rule.replacement);
      }
    }
    file.contents = Buffer.from(content);
    return file;
  };
}
