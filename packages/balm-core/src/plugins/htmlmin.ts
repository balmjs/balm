// Reference `gulp-htmlmin@5.0.1`
import { TransformCallback } from 'node:stream';
import { minify } from 'html-minifier-terser';
import { BalmError } from '@balm-core/index.js';

const PLUGIN_NAME = 'htmlmin';

function gulpHtmlmin(options: object): any {
  options = BalmJS.utils.deepMerge({}, options);

  function transform(
    file: Buffer | string | any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    if (file.isNull()) {
      callback(null, file);
      return;
    }

    async function htmlMinify(
      buf: any,
      enc: string | null,
      cb: TransformCallback
    ): Promise<void> {
      try {
        const minified = await minify(buf.toString(), options);
        const contents = Buffer.from(minified);
        if (cb === callback) {
          file.contents = contents;
          cb(null, file);
        } else {
          cb(null, contents);
          callback(null, file);
        }
      } catch (e) {
        const opts = Object.assign(options, { fileName: file.path });
        const error = new PluginError(PLUGIN_NAME, e as BalmError, opts);
        cb === callback ? cb(error) : callback(error);
      }
    }

    if (file.isStream()) {
      file.contents = file.contents.pipe(through2(htmlMinify));
    } else {
      htmlMinify(file.contents, null, callback);
    }
  }

  return through2.obj(transform);
}

export default gulpHtmlmin;
