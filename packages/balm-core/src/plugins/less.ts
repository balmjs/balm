// Reference `gulp-less@5.0.0`
import { TransformCallback } from 'node:stream';
import less from 'less';
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
  css: string;
  imports: string[];
  sourcemap?: LessResultSourcemap;
}

function inlineSources(sourcemap: LessResultSourcemap) {
  if (sourcemap.sourcesContent) {
    return Promise.resolve(sourcemap);
  }

  return Promise.all(
    sourcemap.sources.map((source: string) => {
      return new Promise((resolve, reject) => {
        node.fs.readFile(source, 'utf8', (err: any, data: any) => {
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

function renderLess(input: string, options: LooseObject) {
  return new Promise((resolve, reject) => {
    less.render(
      input,
      options,
      (
        error: any,
        output: {
          css: string;
          imports: string[];
          map: string; // JSON string
        }
      ) => {
        if (error) {
          reject(error);
        } else {
          const { css, imports } = output;
          const result: LessResult = {
            css,
            imports
          };

          if (options.sourceMap && output.map) {
            result.sourcemap = JSON.parse(output.map) as LessResultSourcemap;
            inlineSources(result.sourcemap).then((map) => {
              result.sourcemap = map;
              resolve(result);
            });
          } else {
            resolve(result);
          }
        }
      }
    );
  });
}

function gulpLess(customOptions: object): any {
  // Mixes in default options.
  const options: LooseObject = Object.assign(
    {},
    {
      compress: false,
      paths: []
    },
    customOptions
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

      const input = file.contents.toString() as string;

      // Injects the path of the current file
      options.filename = file.path;

      // Bootstrap source maps
      if (file.sourceMap || options.sourcemap) {
        options.sourceMap = true;
      }

      renderLess(input, options)
        .then((output: any) => {
          file.contents = Buffer.from(output.css as string);
          file.path = replaceExtension(file.path, '.css');
          if (output.sourcemap) {
            output.sourcemap.file = file.relative;
            output.sourcemap.sources = output.sourcemap.sources.map(
              (source: string) =>
                node.path.relative(file.base as string, source)
            );

            applySourceMap(file, output.sourcemap);
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
