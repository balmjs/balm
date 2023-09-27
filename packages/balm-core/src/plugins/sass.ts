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
      if (!opts.importer) {
        const aliasKeys = Object.keys(BalmJS.config.scripts.alias).filter(
          (key) => /^@[a-z0-9-]{1,213}/.test(key)
        );

        if (aliasKeys.length) {
          const aliasKeyRegex = new RegExp(`^${aliasKeys.join('|')}`);

          opts.importer = [
            function (url: string) {
              let file = url;

              const result = url.match(aliasKeyRegex);
              const key = result ? result[0] : null;
              if (key) {
                file = url.replace(
                  aliasKeyRegex,
                  BalmJS.config.scripts.alias[key]
                );

                BalmJS.logger.debug(
                  `${PLUGIN_NAME} alias`,
                  `${url} -> ${file}`
                );
              }

              return { file };
            }
          ];
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
