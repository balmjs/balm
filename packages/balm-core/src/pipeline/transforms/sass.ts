import * as sass from 'sass';
import path from 'node:path';
import { TransformFn } from '../pipeline.js';
import { logger } from '../../utilities/logger.js';

export interface SassTransformOptions {
  includePaths?: string[];
  style?: 'expanded' | 'compressed';
  sourceMap?: boolean;
  [key: string]: any;
}

export function transformSass(options: SassTransformOptions = {}): TransformFn {
  return async (file) => {
    // Only process .scss / .sass files
    if (!/\.(scss|sass)$/i.test(file.extname)) return file;
    // Skip partials starting with '_'
    if (path.basename(file.path).startsWith('_')) return null;

    try {
      const includePaths = [
        path.dirname(file.path),
        path.resolve(file.cwd, 'node_modules'),
        ...(options.includePaths || [])
      ];

      const result = await sass.compileStringAsync(file.toString(), {
        syntax: file.extname === '.sass' ? 'indented' : 'scss',
        loadPaths: includePaths,
        style: options.style || 'expanded',
        sourceMap: options.sourceMap || false
      });

      file.contents = Buffer.from(result.css);
      file.extname = '.css';
      return file;
    } catch (err: any) {
      logger.error('sass', `Error compiling ${file.path}: ${err.message}`);
      throw err;
    }
  };
}
