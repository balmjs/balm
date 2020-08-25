import { TransformCallback } from 'stream';
import { minify } from 'terser';

const PLUGIN_NAME = 'jsmin';

async function jsMinify(file: any, opts: object, cb: Function): Promise<any> {
  const extname = path.extname(file.path);

  if (extname === '.js') {
    const code: any = {};

    let content = file.contents.toString();
    code[path.basename(file.path)] = content;

    try {
      const result = await minify(code, opts);
      content = result.code;

      file.contents = Buffer.from(content);
      cb(null, file);
    } catch (e) {
      const error = new PluginError(PLUGIN_NAME, e);
      cb(error);
    }
  } else {
    BalmJS.logger.error(PLUGIN_NAME, 'Invalid JS file');
  }

  return file;
}

function gulpJsmin(options: object): any {
  options = BalmJS.utils.deepMerge({}, options);

  function transform(
    this: any,
    chunk: Buffer | string | any,
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

    jsMinify(chunk, options, callback);
  }

  return through2.obj(transform);
}

export default gulpJsmin;
