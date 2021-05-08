// Reference `gulp-rename@2.0.0`
import { Transform, TransformCallback } from 'stream';
import { RenameOptions } from '@balm-core/index';

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
      ? node.path.basename(_path).slice(node.path.basename(_path).indexOf('.'))
      : node.path.extname(_path);

    return {
      dirname: node.path.dirname(_path),
      basename: node.path.basename(_path, extname),
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

      _path = node.path.join(
        parsedPath.dirname,
        parsedPath.basename + parsedPath.extname
      );
    } else if (type === 'object' && obj !== undefined && obj !== null) {
      const _obj = obj as RenameOptions;
      const dirname = _obj.dirname || parsedPath.dirname;
      const prefix: string = _obj.prefix || '';
      const suffix: string = _obj.suffix || '';
      const basename: string = _obj.basename || parsedPath.basename;
      const extname: string = _obj.extname || parsedPath.extname;

      const filename = prefix + basename + suffix + extname;

      _path = node.path.join(dirname, filename);
    } else {
      callback(
        new Error('Unsupported renaming parameter type supplied'),
        undefined
      );
      return;
    }

    file.path = node.path.join(file.base, _path);

    // Rename sourcemap if present
    if (file.sourceMap) {
      file.sourceMap.file = file.relative;
    }

    callback(null, file);
  };

  return stream;
}

export default gulpRename;
