import less from 'less';
import path from 'node:path';
import { TransformFn } from '../pipeline.js';
import { logger } from '../../utilities/logger.js';

export interface LessTransformOptions {
  paths?: string[];
  [key: string]: any;
}

export function transformLess(options: LessTransformOptions = {}): TransformFn {
  return async (file) => {
    if (!/\.less$/i.test(file.extname)) return file;
    if (path.basename(file.path).startsWith('_')) return null;

    try {
      const paths = [
        path.dirname(file.path),
        path.resolve(file.cwd, 'node_modules'),
        ...(options.paths || [])
      ];

      const result = await less.render(file.toString(), {
        filename: file.path,
        paths,
        ...options
      });

      file.contents = Buffer.from(result.css);
      file.extname = '.css';
      return file;
    } catch (err: any) {
      logger.error('less', `Error compiling ${file.path}: ${err.message}`);
      throw err;
    }
  };
}
