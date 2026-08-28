import less from 'less';
import path from 'node:path';
import { TransformFn } from '../pipeline.js';
import { logger } from '../../utilities/logger.js';

export interface LessTransformOptions {
  paths?: string[];
  alias?: Record<string, string>;
  [key: string]: any;
}

class AliasFileManager extends less.FileManager {
  private alias: Record<string, string>;

  constructor(alias: Record<string, string> = {}) {
    super();
    this.alias = alias;
  }

  supports(filename: string): boolean {
    const clean = filename.startsWith('~') ? filename.slice(1) : filename;
    return Object.keys(this.alias).some((k) => clean === k || clean.startsWith(`${k}/`));
  }

  loadFile(filename: string, currentDirectory: string, options: any, environment: any): Promise<any> {
    const clean = filename.startsWith('~') ? filename.slice(1) : filename;
    for (const [k, v] of Object.entries(this.alias)) {
      if (clean === k) {
        return super.loadFile(v, currentDirectory, options, environment);
      } else if (clean.startsWith(`${k}/`)) {
        const sub = clean.slice(k.length + 1);
        return super.loadFile(path.join(v, sub), currentDirectory, options, environment);
      }
    }
    return super.loadFile(filename, currentDirectory, options, environment);
  }
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

      const plugins = [...(options.plugins || [])];
      if (options.alias && Object.keys(options.alias).length > 0) {
        plugins.push({
          install: (lessInstance: any, pluginManager: any) => {
            pluginManager.addFileManager(new AliasFileManager(options.alias));
          }
        });
      }

      const result = await less.render(file.toString(), {
        filename: file.path,
        paths,
        ...options,
        plugins
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
