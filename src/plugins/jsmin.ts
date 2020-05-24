import { TransformCallback } from 'stream';
import Terser from 'terser';

const PLUGIN_NAME = 'jsmin';

function minify(file: any, opts: object, cb: Function): void {
  const extname = path.extname(file.path);

  if (extname === '.js') {
    const code: any = {};

    let content = file.contents.toString();
    code[path.basename(file.path)] = content;

    try {
      const result: any = Terser.minify(code, opts);
      if (result.error) {
        throw result.error;
      }
      content = result.code;

      file.contents = Buffer.from(content);
      cb(null, file);
    } catch (error) {
      const _error = new PluginError(PLUGIN_NAME, error);
      cb(_error);
    }
  } else {
    BalmJS.logger.error(PLUGIN_NAME, 'Invalid JS file');
  }

  return file;
}

function gulpJsmin(options: object): any {
  options = BalmJS.utils.deepMerge({}, options);

  function _transform(
    this: any,
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    if (chunk.isStream()) {
      return this.emit(
        'error',
        new PluginError(PLUGIN_NAME, 'Streams not supported')
      );
    }

    if (chunk.isNull()) {
      callback(null, chunk);
      return;
    }

    minify(chunk, options, callback);
  }

  return through2.obj(_transform);
}

export default gulpJsmin;
