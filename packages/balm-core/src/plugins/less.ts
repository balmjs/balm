import { TransformCallback } from 'stream';
import less from 'less';
import replaceExtension from 'replace-ext';
import applySourceMap from '../utilities/vinyl-sourcemaps-apply.js';
import { LooseObject } from '@balm-core/index';

const PLUGIN_NAME = 'less';

function gulpLess(options: object): any {
  // Mixes in default options.
  const opts: LooseObject = Object.assign(
    {},
    {
      compress: false,
      paths: []
    },
    options
  );

  return through2.obj(
    (
      file: Buffer | string | any,
      enc: BufferEncoding,
      cb: TransformCallback
    ) => {
      if (file.isNull()) {
        return cb(null, file);
      }

      if (file.isStream()) {
        return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      }

      const str = file.contents.toString();

      // Injects the path of the current file
      opts.filename = file.path;

      // Bootstrap source maps
      if (file.sourceMap) {
        opts.sourcemap = true;
      }

      less
        .render(str, opts)
        .then((res: any) => {
          file.contents = Buffer.from(res.css);
          file.path = replaceExtension(file.path, '.css');
          if (res.sourcemap) {
            res.sourcemap.file = file.relative;
            res.sourcemap.sources = res.sourcemap.sources.map(
              (source: string) => node.path.relative(file.base, source)
            );

            applySourceMap(file, res.sourcemap);
          }
          return file;
        })
        .then((file: any) => {
          cb(null, file);
        })
        .catch((err: any) => {
          // Convert the keys so PluginError can read them
          err.lineNumber = err.line;
          err.fileName = err.filename;

          // Add a better error message
          err.message = `${err.message} in file ${err.fileName} line no.${err.lineNumber}`;
          return cb(new PluginError(PLUGIN_NAME, err));
        });
    }
  );
}

export default gulpLess;
