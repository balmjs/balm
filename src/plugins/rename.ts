// From `gulp-rename`
import stream from 'stream';

function _parsePath(
  _path: string
): {
  dirname: string;
  basename: string;
  extname: string;
} {
  const extname = path.extname(_path);

  return {
    dirname: path.dirname(_path),
    basename: path.basename(_path, extname),
    extname
  };
}

function gulpRename(obj: any): any {
  const _stream: any = new stream.Transform({ objectMode: true });

  _stream.prototype._transform = function(
    originalFile: any,
    encoding: string,
    callback: Function
  ): void {
    let file: any = originalFile.clone({ contents: false });
    const parsedPath = _parsePath(file.relative);
    let _path;
    let finished = true;

    const type = BalmJS.utils.getType(obj);

    switch (type) {
      case 'string':
        if (obj !== '') {
          _path = obj;
        }
        break;
      case 'function':
        obj(parsedPath, file);
        _path = path.join(
          parsedPath.dirname,
          parsedPath.basename + parsedPath.extname
        );
        break;
      case 'object': {
        const dirname = obj.dirname || parsedPath.dirname;
        const prefix = obj.prefix || '';
        const basename = obj.basename || parsedPath.basename;
        const suffix = obj.suffix || '';
        const extname = obj.extname || parsedPath.extname;
        _path = path.join(dirname, prefix + basename + suffix + extname);
        break;
      }
      default:
        finished = false;
    }

    if (finished) {
      file.path = path.join(file.base, _path);

      // Rename sourcemap if present
      if (file.sourceMap) {
        file.sourceMap.file = file.relative;
      }
    } else {
      file = undefined;

      BalmJS.logger.error(
        '<rename>',
        'Unsupported renaming parameter type supplied'
      );
    }

    callback(null, file);
  };

  return _stream;
}

export default gulpRename;
