// Reference `gulp-sass@6.0.1`
import { Transform, TransformCallback } from 'node:stream';
import semver from 'semver';
import * as sass from 'sass';
import replaceExtension from 'replace-ext';
import stripAnsi from 'strip-ansi';
import applySourceMap from 'vinyl-sourcemaps-apply';
import { BalmError, SassOptions, CompileResult } from '@balm-core/index.js';
import ansiColors from 'ansi-colors';

const sassModule = node.getSassModule(sass);

const PLUGIN_NAME = 'sass';

interface GulpSass {
  (options: object): any;
  compiler?: any;
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
  file.contents = Buffer.from(result.css);
  file.path = replaceExtension(file.path, '.css');

  // Build Source Maps!
  if (result.sourceMap) {
    const proto = /^file:\/\/?/;
    const leadingSlash = /^\//;
    const sassMap = result.sourceMap;
    const base = node.path.resolve(file.cwd, file.base);

    if (!sassMap.file) {
      // Convert from absolute path to relative as in gulp-sass 5.0.0
      sassMap.file = file.history[0]
        .replace(base + node.path.sep, '')
        .replace(proto, '');
    }

    // Transform to relative file paths as in gulp-sass 5.0.0
    sassMap.sources = sassMap.sources.map((src) => {
      // file uses Windows-style path separators, source is a URL.
      const baseUri = base.replace(/\\/g, '/');
      // The current file and its content is included
      // as data:<encoded file contents> in the new Sass JS API.
      // Map it to the original file name (first history entry).
      if (src.startsWith('data:')) {
        return file.history[0]
          .replace(/\\/g, '/')
          .replace(`${baseUri}/`, '')
          .replace(proto, '')
          .replace(leadingSlash, '');
      }
      return src
        .replace(proto, '')
        .replace(`${baseUri}/`, '')
        .replace(leadingSlash, '');
    });

    // Grab the base filename that's being worked on
    const sassFileSrc = file.relative;
    // Replace the map file with the original filename (but new extension)
    sassMap.file = replaceExtension(sassFileSrc, '.css');

    if (
      file.sourceMap &&
      file.sourceMap.sourcesContent &&
      !sassMap.sourcesContent
    ) {
      sassMap.sourcesContent = file.sourceMap.sourcesContent;
    }

    // Apply the map
    applySourceMap(file, sassMap);
  }

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
  const filePath =
    (error.file === 'stdin' ? file.path : error.file) || file.path;
  const relativePath = node.path.relative(process.cwd(), filePath);
  const message = `${ansiColors.underline(relativePath)}\n${error.message}`;

  error.message = stripAnsi(message);

  return callback(new PluginError(PLUGIN_NAME, error as BalmError));
}

//////////////////////////////
// Main Gulp Sass function
//////////////////////////////
const gulpSass: GulpSass = (options: SassOptions, sync = false): any =>
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

      // Ensure `indented` if a `.sass` file
      if (node.path.extname(file.path) === '.sass') {
        opts.syntax = 'indented';
      }

      // Ensure file's parent directory in the include path
      if (opts.loadPaths) {
        if (typeof opts.loadPaths === 'string') {
          opts.loadPaths = [opts.loadPaths];
        }
      } else {
        opts.loadPaths = [];
      }

      opts.loadPaths.unshift(node.path.dirname(file.path));

      // Generate Source Maps if the source-map plugin is present
      if (file.sourceMap) {
        opts.sourceMap = true;
        opts.sourceMapIncludeSources = true;
      }

      const fileContents = file.contents.toString();
      if (sync !== true) {
        /**
         * Async Sass compile
         */
        sassModule
          .compileStringAsync(fileContents, opts)
          .then((compileResult: CompileResult) => {
            filePush(file, compileResult, callback);
          })
          .catch((error: any) => {
            handleError(error, file, callback);
          });
      } else {
        /**
         * Sync Sass compile
         */
        try {
          filePush(
            file,
            sassModule.compileString(fileContents, opts),
            callback
          );
        } catch (error: any) {
          handleError(error, file, callback);
        }
      }
    }
  );

export default gulpSass;
