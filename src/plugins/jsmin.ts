import Terser from 'terser';

const PLUGIN_NAME = 'jsmin';

function gulpJsmin(options: object): any {
  options = BalmJS.utils.deepMerge({}, options);

  function _transform(
    this: any,
    file: any,
    encoding: string,
    callback: Function
  ): any {
    if (file.isStream()) {
      return this.emit(
        'error',
        new PluginError(PLUGIN_NAME, 'Streams not supported')
      );
    }

    if (file.isNull()) {
      callback(null, file);
      return;
    }

    function minify(file: any, opts: object, cb: Function): any {
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
        } catch (e) {
          const error = new PluginError(PLUGIN_NAME, e);
          cb(error);
        }
      } else {
        BalmJS.logger.error(PLUGIN_NAME, 'Invalid JS file');
      }

      return file;
    }

    minify(file, options, callback);
  }

  return through2.obj(_transform);
}

export default gulpJsmin;
