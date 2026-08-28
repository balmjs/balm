import path from 'node:path';
import { TransformFn } from '../pipeline.js';
import { RenameOptions } from '../../types/index.js';

export function transformRename(
  options: string | Function | RenameOptions = {}
): TransformFn {
  return async (file) => {
    if (typeof options === 'string') {
      file.path = path.resolve(path.dirname(file.path), options);
      return file;
    }

    if (typeof options === 'function') {
      const parsed = {
        dirname: path.dirname(file.path),
        basename: file.stem,
        extname: file.extname
      };
      const result = options(parsed);
      if (result) {
        if (result.dirname) file.path = path.join(result.dirname, path.basename(file.path));
        if (result.basename) file.stem = result.basename;
        if (result.extname) file.extname = result.extname;
      }
      return file;
    }

    const { dirname, prefix = '', basename, suffix = '', extname } = options;
    const currentDir = dirname ? path.resolve(file.cwd, dirname) : path.dirname(file.path);
    const base = basename !== undefined ? basename : file.stem;
    const ext = extname !== undefined ? extname : file.extname;

    file.path = path.join(currentDir, `${prefix}${base}${suffix}${ext.startsWith('.') ? ext : `.${ext}`}`);
    return file;
  };
}
