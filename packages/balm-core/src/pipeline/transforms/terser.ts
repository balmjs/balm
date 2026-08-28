import { minify, MinifyOptions } from 'terser';
import { TransformFn } from '../pipeline.js';
import { logger } from '../../utilities/logger.js';

export function transformTerser(options: MinifyOptions = {}): TransformFn {
  return async (file) => {
    if (!/\.js$/i.test(file.extname)) return file;

    try {
      const result = await minify(file.toString(), options);
      if (result.code) {
        file.contents = Buffer.from(result.code);
      }
      return file;
    } catch (err: any) {
      logger.error('terser', `Error minifying ${file.path}: ${err.message}`);
      throw err;
    }
  };
}
