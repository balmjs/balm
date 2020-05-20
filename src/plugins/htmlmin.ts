// Reference `gulp-htmlmin@5.0.1`
import htmlmin from 'html-minifier';

const PLUGIN_NAME = 'htmlmin';

function gulpHtmlmin(options: object): any {
  options = BalmJS.utils.deepMerge({}, options);

  function _transform(file: any, encoding: string, callback: Function): any {
    if (file.isNull()) {
      callback(null, file);
      return;
    }

    function minify(buf: any, enc: string | null, cb: Function): any {
      try {
        const contents = Buffer.from(htmlmin.minify(buf.toString(), options));
        if (cb === callback) {
          file.contents = contents;
          cb(null, file);
        } else {
          cb(null, contents);
          callback(null, file);
        }
      } catch (e) {
        const opts = Object.assign(options, { fileName: file.path });
        const error = new PluginError(PLUGIN_NAME, e, opts);
        cb === callback ? cb(error) : callback(error);
      }
    }

    if (file.isStream()) {
      file.contents = file.contents.pipe(through2(minify));
    } else {
      minify(file.contents, null, callback);
    }
  }

  return through2.obj(_transform);
}

export default gulpHtmlmin;
