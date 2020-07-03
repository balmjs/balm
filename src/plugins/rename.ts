// Reference `gulp-rename@2.0.0`
import { Transform, TransformCallback } from 'stream';
import path from 'path';
import { RenameOptions } from '@balm/index';

interface GulpRenameOptions {
  multiExt?: boolean;
}

interface GulpRenamePath {
  dirname: string;
  basename: string;
  extname: string;
}

function gulpRename(
  obj: string | Function | object,
  options: GulpRenameOptions = {}
): any {
  const stream = new Transform({ objectMode: true });

  const parsePath = (_path: string): GulpRenamePath => {
    const extname = options.multiExt
      ? path.basename(_path).slice(path.basename(_path).indexOf('.'))
      : path.extname(_path);

    return {
      dirname: path.dirname(_path),
      basename: path.basename(_path, extname),
      extname: extname
    };
  };

  stream._transform = (
    chunk: Buffer | string | any,
    unused: BufferEncoding,
    callback: TransformCallback
  ): void => {
    const file = chunk.clone({ contents: false });
    let parsedPath = parsePath(file.relative);
    let _path: string;

    const type = typeof obj;

    if (type === 'string' && obj !== '') {
      _path = obj as string;
    } else if (type === 'function') {
      const newParsedPath = (obj as Function)(parsedPath, file);
      if (typeof newParsedPath === 'object' && newParsedPath !== null) {
        parsedPath = newParsedPath;
      }

      _path = path.join(
        parsedPath.dirname,
        parsedPath.basename + parsedPath.extname
      );
    } else if (type === 'object' && obj !== undefined && obj !== null) {
      const _obj = obj as RenameOptions;
      const dirname = _obj.dirname || parsedPath.dirname;
      const prefix = _obj.prefix || '';
      const suffix = _obj.suffix || '';
      const basename = _obj.basename || parsedPath.basename;
      const extname = _obj.extname || parsedPath.extname;

      _path = path.join(dirname, prefix + basename + suffix + extname);
    } else {
      callback(
        new Error('Unsupported renaming parameter type supplied'),
        undefined
      );
      return;
    }

    file.path = path.join(file.base, _path);

    // Rename sourcemap if present
    if (file.sourceMap) {
      file.sourceMap.file = file.relative;
    }

    callback(null, file);
  };

  return stream;
}

export default gulpRename;
