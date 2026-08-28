import * as sass from 'sass';
import path from 'node:path';
import fs from 'node:fs';
import { TransformFn } from '../pipeline.js';
import { logger } from '../../utilities/logger.js';

export interface SassTransformOptions {
  includePaths?: string[];
  alias?: Record<string, string>;
  style?: 'expanded' | 'compressed';
  sourceMap?: boolean;
  [key: string]: any;
}

function resolveFile(baseDir: string, url: string): string | null {
  const possiblePaths = [
    path.resolve(baseDir, url),
    path.resolve(baseDir, `${url}.scss`),
    path.resolve(baseDir, `${url}.sass`),
    path.resolve(baseDir, `${url}.css`),
    path.resolve(baseDir, path.dirname(url), `_${path.basename(url)}.scss`),
    path.resolve(baseDir, path.dirname(url), `_${path.basename(url)}.sass`),
    path.resolve(baseDir, url, '_index.scss'),
    path.resolve(baseDir, url, '_index.sass'),
    path.resolve(baseDir, url, 'index.scss'),
    path.resolve(baseDir, url, 'index.sass')
  ];

  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        return p;
      }
    } catch {
      // ignore
    }
  }
  return null;
}

export function transformSass(options: SassTransformOptions = {}): TransformFn {
  return async (file) => {
    // Only process .scss / .sass files
    if (!/\.(scss|sass)$/i.test(file.extname)) return file;
    // Skip partials starting with '_'
    if (path.basename(file.path).startsWith('_')) return null;

    try {
      const searchDirs = [
        path.dirname(file.path),
        path.resolve(file.cwd, 'node_modules'),
        path.resolve(process.cwd(), 'node_modules'),
        path.resolve(process.cwd(), '..', 'node_modules'),
        ...(options.includePaths || [])
      ];

      const customImporter: sass.FileImporter<'async'> = {
        findFileUrl(url) {
          let cleanUrl = url;
          if (cleanUrl.startsWith('~')) {
            cleanUrl = cleanUrl.slice(1);
          }

          // 1. Check alias resolution
          if (options.alias) {
            for (const [aliasKey, aliasTarget] of Object.entries(options.alias)) {
              if (cleanUrl === aliasKey) {
                const resolved = resolveFile(path.dirname(aliasTarget), path.basename(aliasTarget));
                if (resolved) return new URL(`file://${resolved}`);
              } else if (cleanUrl.startsWith(`${aliasKey}/`)) {
                const subPath = cleanUrl.slice(aliasKey.length + 1);
                const resolved = resolveFile(aliasTarget, subPath);
                if (resolved) return new URL(`file://${resolved}`);
              }
            }
          }

          // 2. Check searchDirs
          for (const dir of searchDirs) {
            const resolved = resolveFile(dir, cleanUrl);
            if (resolved) {
              return new URL(`file://${resolved}`);
            }
          }
          return null;
        }
      };

      const result = await sass.compileStringAsync(file.toString(), {
        url: new URL(`file://${file.path}`),
        syntax: file.extname === '.sass' ? 'indented' : 'scss',
        loadPaths: searchDirs,
        importers: [customImporter, new sass.NodePackageImporter()],
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
