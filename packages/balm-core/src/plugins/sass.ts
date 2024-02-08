import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
// Reference `gulp-sass@5.1.0`
import { Transform, TransformCallback } from 'node:stream';
import semver from 'semver';
import * as sass from 'sass';
import replaceExtension from 'replace-ext';
import stripAnsi from 'strip-ansi';
import applySourceMap from 'vinyl-sourcemaps-apply';
import {
  BalmError,
  SassOptions,
  CompileResult,
  LegacyOptions,
  LegacyResult
} from '@balm-core/index';
import ansiColors from 'ansi-colors';

process.env.BALM_CWD = process.env.INIT_CWD || process.cwd();
const localSassModule = node.path.join(
  process.env.BALM_CWD,
  'node_modules',
  'sass'
);
let isLegacy = false;
try {
  const sassPkg = requireModule(
    node.path.join(localSassModule, 'package.json')
  );
  isLegacy = semver.lt(sassPkg.version, '1.40.0');
} catch (_) {}

const nodeLocalSassModule = node.path.join(localSassModule, 'sass.node.js');
const defaultLocalSassModule = node.path.join(
  localSassModule,
  'sass.default.js'
); // For `npm i -D sass <= 1.62.1`
const dartLocalSassModule = node.path.join(localSassModule, 'sass.dart.js'); // For `npm i -D sass <= 1.39.2`
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

interface SassModule {
  compile: (path: string, options?: SassOptions) => CompileResult;
  renderSync: (options: LegacyOptions) => LegacyResult;
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
function filePush(
  file: Buffer | string | any,
  result: CompileResult,
  callback: TransformCallback
) {
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
}

function legacyFilePush(
  file: Buffer | string | any,
  sassObject: LegacyResult,
  callback: TransformCallback
) {
  // Build Source Maps!
  if (sassObject.map) {
    // Transform map into JSON
    const sassMap = JSON.parse(sassObject.map.toString() as string);
    // Grab the stdout and transform it into stdin
    const sassMapFile = sassMap.file.replace(/^stdout$/, 'stdin');
    // Grab the base filename that's being worked on
    const sassFileSrc = file.relative as string;
    // Grab the path portion of the file that's being worked on
    const sassFileSrcPath = node.path.dirname(sassFileSrc);

    if (sassFileSrcPath) {
      const sourceFileIndex = sassMap.sources.indexOf(sassMapFile);
      // Prepend the path to all files in the sources array except the file that's being worked on
      sassMap.sources = sassMap.sources.map((source: string, index: number) =>
        index === sourceFileIndex
          ? source
          : node.path.join(sassFileSrcPath, source)
      );
    }

    // Remove 'stdin' from sources and replace with filenames!
    sassMap.sources = sassMap.sources.filter(
      (src: string) => src !== 'stdin' && src
    );

    // Replace the map file with the original filename (but new extension)
    sassMap.file = replaceExtension(sassFileSrc, '.css');
    // Apply the map
    applySourceMap(file, sassMap);
  }

  file.contents = sassObject.css;
  file.path = replaceExtension(file.path, '.css');

  if (file.stat) {
    file.stat.atime = file.stat.mtime = file.stat.ctime = new Date();
  }

  callback(null, file);
}

/**
 * Handles error message
 */
function handleError(
  error: any,
  file: Buffer | string | any,
  callback: TransformCallback
) {
  const relativePath = node.path.relative(process.cwd(), file.path as string);
  const message = `${ansiColors.underline(relativePath)}\n${error.message}`;

  error.message = stripAnsi(message);

  return callback(new PluginError(PLUGIN_NAME, error as BalmError));
}

function legacyHandleError(
  error: any,
  file: Buffer | string | any,
  callback: TransformCallback
) {
  const filePath = ((error.file === 'stdin' ? file.path : error.file) ||
    file.path) as string;
  const relativePath = node.path.relative(process.cwd(), filePath);
  const message = `${ansiColors.underline(relativePath)}\n${error.formatted}`;

  error.messageFormatted = message;
  error.messageOriginal = error.message;
  error.message = stripAnsi(message);
  error.relativePath = relativePath;

  return callback(new PluginError(PLUGIN_NAME, error as BalmError));
}

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

      const opts = (options || {}) as any;
      if (isLegacy) {
        opts.data = file.contents.toString();

        // We set the file path here so that libsass can correctly resolve import paths
        opts.file = file.path;

        // Ensure `indentedSyntax` is true if a `.sass` file
        if (node.path.extname(file.path as string) === '.sass') {
          opts.indentedSyntax = true;
        }

        // Ensure file's parent directory in the include path
        if (opts.includePaths) {
          if (typeof opts.includePaths === 'string') {
            opts.includePaths = [opts.includePaths];
          }
        } else {
          opts.includePaths = [];
        }

        opts.includePaths.unshift(node.path.dirname(file.path as string));

        // Generate Source Maps if the source-map plugin is present
        if (file.sourceMap) {
          opts.sourceMap = file.path;
          opts.omitSourceMapUrl = true;
          opts.sourceMapContents = true;
        }

        // Create alias
        if (!opts.importer) {
          const aliasKeys = Object.keys(BalmJS.config.scripts.alias).filter(
            (key) => /^@[a-z0-9-]{1,213}/.test(key)
          );

          if (aliasKeys.length) {
            const aliasKeyRegex = new RegExp(`^(${aliasKeys.join('|')})/`);

            opts.importer = [
              function (url: string) {
                let file = url;

                const result = url.match(aliasKeyRegex);
                const key = result ? result[1] : null;
                if (key) {
                  file = url.replace(
                    key,
                    (BalmJS.config.scripts.alias as { [key: string]: string })[
                      key
                    ]
                  );

                  BalmJS.logger.debug(
                    `${PLUGIN_NAME} alias`,
                    `${key} -> ${url} => ${file}`
                  );
                }

                return { file };
              }
            ];
          }
        }
      } else {
        // Create alias
        if (!options.importers) {
          const aliasKeys = Object.keys(BalmJS.config.scripts.alias).filter(
            (key) => /^@[a-z0-9-]{1,213}/.test(key)
          );

          if (aliasKeys.length) {
            const aliasKeyRegex = new RegExp(`^(${aliasKeys.join('|')})/`);

            options.importers = [
              {
                findFileUrl(url: string) {
                  let file = url;

                  const result = url.match(aliasKeyRegex);
                  const key = result ? result[1] : null;
                  if (key) {
                    file = url.replace(
                      key,
                      (
                        BalmJS.config.scripts.alias as { [key: string]: string }
                      )[key]
                    );

                    BalmJS.logger.debug(
                      `${PLUGIN_NAME} alias`,
                      `${key} -> ${url} => ${file}`
                    );
                  }

                  return pathToFileURL(file);
                }
              }
            ];
          }
        }
      }

      try {
        isLegacy
          ? legacyFilePush(
              file,
              (sassModule as SassModule).renderSync(opts),
              callback
            )
          : filePush(
              file,
              (sassModule as SassModule).compile(file.path as string, options),
              callback
            );
      } catch (error) {
        isLegacy
          ? legacyHandleError(error, file, callback)
          : handleError(error, file, callback);
      }
    }
  );

export default gulpSass;
export { isLegacy };
