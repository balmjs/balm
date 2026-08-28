import { minify } from 'html-minifier-terser';
import { TransformFn } from '../pipeline.js';
import { logger } from '../../utilities/logger.js';

export function transformHtmlmin(options: Record<string, any> = {}): TransformFn {
  return async (file) => {
    if (!/\.html$/i.test(file.extname)) return file;

    try {
      const minified = await minify(file.toString(), options);
      file.contents = Buffer.from(minified);
      return file;
    } catch (err: any) {
      logger.error('htmlmin', `Error minifying ${file.path}: ${err.message}`);
      throw err;
    }
  };
}
