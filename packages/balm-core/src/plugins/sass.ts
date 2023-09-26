// Reference `gulp-sass@5.1.0`
import { Transform, TransformCallback } from 'stream';
import sass from 'sass';
import replaceExtension from 'replace-ext';
import applySourceMap from 'vinyl-sourcemaps-apply';
import { BalmError } from '@balm-core/index';

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
const filePush = (
  file: Buffer | string | any,
  sassObject: any,
  callback: TransformCallback
) => {
  // Build Source Maps!
  if (sassObject.map) {
    // Transform map into JSON
    const sassMap = JSON.parse(sassObject.map.toString() as string);
    // Grab the stdout and transform it into stdin
    const sassMapFile = sassMap.file.replace(/^stdout$/, 'stdin');
    // Grab the base filename that's being worked on
    const sassFileSrc = file.relative as string;
    // Grab the path portion of the file that's being worked on
    const sassFileSrcPath = path.dirname(sassFileSrc);

    if (sassFileSrcPath) {
      const sourceFileIndex = sassMap.sources.indexOf(sassMapFile);
      // Prepend the path to all files in the sources array except the file that's being worked on
      sassMap.sources = sassMap.sources.map((source: string, index: number) =>
        index === sourceFileIndex ? source : path.join(sassFileSrcPath, source)
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
};

/**
 * Handles error message
 */
const handleError = (
  error: any,
  file: Buffer | string | any,
  callback: TransformCallback
) => {
  const filePath = ((error.file === 'stdin' ? file.path : error.file) ||
    file.path) as string;
  const relativePath = path.relative(process.cwd(), filePath);
  const message = `${require('ansi-colors').underline(relativePath)}\n${
    error.formatted
  }`;

  error.messageFormatted = message;
  error.messageOriginal = error.message;
  error.message = require('strip-ansi')(message);
  error.relativePath = relativePath;

  return callback(new PluginError(PLUGIN_NAME, error as BalmError));
};

//////////////////////////////
// Main Gulp Sass function
//////////////////////////////
const gulpSass: GulpSass = (options: object): any =>
  transformObj(
    (
      file: Buffer | string | any,
      encoding: BufferEncoding,
      callback: TransformCallback
    ) => {
      if (file.isNull()) {
        callback(null, file);
        return;
      }

      if (file.isStream()) {
        callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
        return;
      }

      if (path.basename(file.path as string).startsWith('_')) {
        callback();
        return;
      }

      if (!file.contents.length) {
        file.path = replaceExtension(file.path, '.css');
        callback(null, file);
        return;
      }

      const opts = (options || {}) as any;
      opts.data = file.contents.toString();

      // We set the file path here so that libsass can correctly resolve import paths
      opts.file = file.path;

      // Ensure `indentedSyntax` is true if a `.sass` file
      if (path.extname(file.path as string) === '.sass') {
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

      opts.includePaths.unshift(path.dirname(file.path as string));

      // Generate Source Maps if the source-map plugin is present
      if (file.sourceMap) {
        opts.sourceMap = file.path;
        opts.omitSourceMapUrl = true;
        opts.sourceMapContents = true;
      }

      // Create alias
      if (!opts.importer && Object.keys(BalmJS.config.scripts.alias).length) {
        opts.importer = [];
        for (const [key, value] of Object.entries(
          BalmJS.config.scripts.alias
        )) {
          opts.importer.push(function (url: string) {
            if (url.startsWith(key)) {
              const file = url.replace(new RegExp(`^${key}`), value);
              BalmJS.logger.debug(`${PLUGIN_NAME} alias`, `${url} -> ${file}`);

              return { file };
            } else {
              return { file: url };
            }
          });
        }
      }

      //////////////////////////////
      // Sync Sass render
      //////////////////////////////
      try {
        gulpSass.compiler &&
          filePush(file, gulpSass.compiler.renderSync(opts), callback);
      } catch (error) {
        handleError(error, file, callback);
      }
    }
  );

gulpSass.compiler = sass;

export default gulpSass;
