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

const sassModule = node.getSassModule(sass);

const PLUGIN_NAME = 'sass-legacy';

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
  const filePath =
    (error.file === 'stdin' ? file.path : error.file) || file.path;
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
      opts.data = file.contents.toString();

      // We set the file path here so that libsass can correctly resolve import paths
      opts.file = file.path;

      // Ensure `indentedSyntax` is true if a `.sass` file
      if (node.path.extname(file.path) === '.sass') {
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

      opts.includePaths.unshift(node.path.dirname(file.path));

      // Generate Source Maps if the source-map plugin is present
      if (file.sourceMap) {
        opts.sourceMap = file.path;
        opts.omitSourceMapUrl = true;
        opts.sourceMapContents = true;
      }

      if (sync !== true) {
        /**
         * Async Sass render
         */
        sassModule.render(opts, (error: any, obj: any) => {
          if (error) {
            handleError(error, file, callback);
            return;
          }

          filePush(file, obj, callback);
        });
      } else {
        /**
         * Sync Sass render
         */
        try {
          filePush(file, sassModule.renderSync(opts), callback);
        } catch (error: any) {
          handleError(error, file, callback);
        }
      }
    }
  );

export default gulpSass;
