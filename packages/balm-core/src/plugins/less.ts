// Reference `gulp-less@5.0.0`
import fs from 'fs';
import { TransformCallback } from 'stream';
import replaceExtension from 'replace-ext';
import applySourceMap from 'vinyl-sourcemaps-apply';
import { LooseObject, BalmError } from '@balm-core/index';

const PLUGIN_NAME = 'less';

interface LessResultSourcemap {
  sourcesContent: any;
  file: string;
  sources: string[];
}

interface LessResult {
  result: string;
  imports: string[];
  sourcemap?: LessResultSourcemap;
  css?: string;
}

function inlineSources(sourcemap: LessResultSourcemap) {
  if (sourcemap.sourcesContent) {
    return Promise.resolve(sourcemap);
  }

  return Promise.all(
    sourcemap.sources.map((source: string) => {
      return new Promise((resolve, reject) => {
        fs.readFile(source, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    })
  ).then(
    (contents) => {
      sourcemap.sourcesContent = contents;
      return sourcemap;
    },
    () => sourcemap
  );
}

function renderLess(str: string, opts: LooseObject) {
  return new Promise((resolve, reject) => {
    require('less').render(
      str,
      opts,
      (
        err: any,
        res: {
          css: string;
          imports: string[];
          map: string; // JSON string
        }
      ) => {
        if (err) {
          reject(err);
        } else {
          const obj: LessResult = {
            result: res.css,
            imports: res.imports
          };

          if (opts.sourceMap && res.map) {
            obj.sourcemap = JSON.parse(res.map) as LessResultSourcemap;
            inlineSources(obj.sourcemap).then((map) => {
              obj.sourcemap = map;
              resolve(obj);
            });
          } else {
            resolve(obj);
          }
        }
      }
    );
  });
}

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

      const str = file.contents.toString() as string;

      // Injects the path of the current file
      opts.filename = file.path;

      // Bootstrap source maps
      if (file.sourceMap || opts.sourcemap) {
        opts.sourceMap = true;
      }

      renderLess(str, opts)
        .then((res: any) => {
          file.contents = Buffer.from(res.result as string);
          file.path = replaceExtension(file.path, '.css');
          if (res.sourcemap) {
            res.sourcemap.file = file.relative;
            res.sourcemap.sources = res.sourcemap.sources.map(
              (source: string) => path.relative(file.base as string, source)
            );

            applySourceMap(file, res.sourcemap);
          }
          return file;
        })
        .then((file: any) => {
          cb(null, file);
        })
        .catch((err) => {
          // Convert the keys so PluginError can read them
          err.lineNumber = err.line;
          err.fileName = err.filename;

          // Add a better error message
          err.message = `${err.message} in file ${err.fileName} line no.${err.lineNumber}`;
          return cb(new PluginError(PLUGIN_NAME, err as BalmError));
        });
    }
  );
}

export default gulpLess;
