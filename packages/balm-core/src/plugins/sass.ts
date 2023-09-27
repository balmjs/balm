import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
// Reference `gulp-sass@5.1.0`
import { Transform, TransformCallback } from 'node:stream';
import * as sass from 'sass';
import replaceExtension from 'replace-ext';
import stripAnsi from 'strip-ansi';
import applySourceMap from 'vinyl-sourcemaps-apply';
import { BalmError, SassOptions, SassImporter } from '@balm-core/index';
import ansiColors from 'ansi-colors';

process.env.BALM_CWD = process.env.INIT_CWD || process.cwd();
const localSassModule = path.join(
  process.env.BALM_ROOT || process.env.BALM_CWD,
  'node_modules',
  'sass'
);
const nodeLocalSassModule = path.join(localSassModule, 'sass.node.js');
const defaultLocalSassModule = path.join(localSassModule, 'sass.default.js'); // For `npm i -D sass <= 1.62.1`
const dartLocalSassModule = path.join(localSassModule, 'sass.dart.js'); // For `npm i -D sass <= 1.39.2`
const sassModule = fs.existsSync(nodeLocalSassModule)
  ? requireModule(nodeLocalSassModule)
  : fs.existsSync(defaultLocalSassModule)
  ? requireModule(defaultLocalSassModule)
  : fs.existsSync(dartLocalSassModule)
  ? requireModule(dartLocalSassModule)
  : sass;

const PLUGIN_NAME = 'sass';

interface GulpSass {
  (options: object): any;
  compiler?: any;
}

interface RawSourceMap {
  version: number;
  sources: string[];
  names: string[];
  sourceRoot?: string;
  sourcesContent?: string[];
  mappings: string;
  file: string;
}

interface CompileResult {
  css: string;
  loadedUrls: URL[];
  sourceMap?: RawSourceMap;
}

interface SassModule {
  compile: (path: string, options?: SassOptions) => CompileResult;
}

const transformObj = (
  transform: (
    this: Transform,
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) => void
): Transform => new Transform({ transform, objectMode: true });

/**
 * Handles returning the file to the stream
 */
const filePush = (
  file: Buffer | string | any,
  result: CompileResult,
  callback: TransformCallback
) => {
  // Build Source Maps!
  if (result.sourceMap) {
    const sassMap = result.sourceMap;
    // Replace the map file with the original filename (but new extension)
    sassMap.file = replaceExtension(file.relative, '.css');
    // Apply the map
    applySourceMap(file, sassMap);
  }

  file.contents = Buffer.from(result.css);
  file.path = replaceExtension(file.path, '.css');

  if (file.stat) {
    file.stat.atime = file.stat.mtime = file.stat.ctime = new Date();
  }

  callback(null, file);
};

/**
 * Handles error message
 */
const handleError = (
  error: any,
  file: Buffer | string | any,
  callback: TransformCallback
) => {
  const relativePath = node.path.relative(process.cwd(), file.path as string);
  const message = `${ansiColors.underline(relativePath)}\n${error.message}`;

  error.message = stripAnsi(message);

  return callback(new PluginError(PLUGIN_NAME, error as BalmError));
};

//////////////////////////////
// Main Gulp Sass function
//////////////////////////////
const gulpSass: GulpSass = (options: SassOptions): any =>
  transformObj(
    (
      file: Buffer | string | any,
      encoding: BufferEncoding,
      callback: TransformCallback
    ) => {
      if (file.isNull()) {
        return callback(null, file);
      }

      if (file.isStream()) {
        return callback(
          new PluginError(PLUGIN_NAME, 'Streaming not supported')
        );
      }

      if (node.path.basename(file.path as string).startsWith('_')) {
        return callback();
      }

      if (!file.contents.length) {
        file.path = replaceExtension(file.path, '.css');
        return callback(null, file);
      }

      const path = file.path;

      // Create alias
      if (!options.importers) {
        const aliasKeys = Object.keys(BalmJS.config.scripts.alias).filter(
          (key) => /^@[a-z0-9-]{1,213}/.test(key)
        );

        if (aliasKeys.length) {
          const aliasKeyRegex = new RegExp(`^${aliasKeys.join('|')}`);

          options.importers = [
            {
              findFileUrl(url: string) {
                let file = url;

                const result = url.match(aliasKeyRegex);
                const key = result ? result[0] : null;
                if (key) {
                  file = url.replace(
                    aliasKeyRegex,
                    (BalmJS.config.scripts.alias as { [key: string]: string })[
                      key
                    ]
                  );

                  BalmJS.logger.debug(
                    `${PLUGIN_NAME} alias`,
                    `${url} -> ${file}`
                  );
                }

                return pathToFileURL(file);
              }
            }
          ];
        }
      }

      try {
        filePush(
          file,
          (sassModule as SassModule).compile(path as string, options),
          callback
        );
      } catch (error) {
        handleError(error, file, callback);
      }
    }
  );

export default gulpSass;
