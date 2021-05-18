import { TransformCallback } from 'stream';
import sass from 'sass';
import replaceExtension from 'replace-ext';
import stripAnsi from 'strip-ansi';
import applySourceMap from 'vinyl-sourcemaps-apply';

const PLUGIN_NAME = 'sass';

//////////////////////////////
// Main Gulp Sass function
//////////////////////////////
const gulpSass = (options: object): any =>
  through2.obj(
    (
      file: Buffer | string | any,
      encoding: BufferEncoding,
      cb: TransformCallback
    ) => {
      if (file.isNull()) {
        return cb(null, file);
      }

      if (file.isStream()) {
        return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      }

      if (node.path.basename(file.path).indexOf('_') === 0) {
        return cb();
      }

      if (!file.contents.length) {
        file.path = replaceExtension(file.path, '.css');
        return cb(null, file);
      }

      const opts = (options || {}) as any;
      opts.data = file.contents.toString();

      // we set the file path here so that libsass can correctly resolve import paths
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

      // Generate Source Maps if plugin source-map present
      if (file.sourceMap) {
        opts.sourceMap = file.path;
        opts.omitSourceMapUrl = true;
        opts.sourceMapContents = true;
      }

      //////////////////////////////
      // Handles returning the file to the stream
      //////////////////////////////
      const filePush = (sassObj: any) => {
        let sassMap;
        let sassMapFile;
        let sassFileSrc: string;
        let sassFileSrcPath: string;
        let sourceFileIndex: number;

        // Build Source Maps!
        if (sassObj.map) {
          // Transform map into JSON
          sassMap = JSON.parse(sassObj.map.toString());
          // Grab the stdout and transform it into stdin
          sassMapFile = sassMap.file.replace(/^stdout$/, 'stdin');
          // Grab the base file name that's being worked on
          sassFileSrc = file.relative;
          // Grab the path portion of the file that's being worked on
          sassFileSrcPath = node.path.dirname(sassFileSrc);
          if (sassFileSrcPath) {
            // Prepend the path to all files in the sources array except the file that's being worked on
            sourceFileIndex = sassMap.sources.indexOf(sassMapFile);
            sassMap.sources = sassMap.sources.map(
              (source: string, index: number) => {
                return index === sourceFileIndex
                  ? source
                  : node.path.join(sassFileSrcPath, source);
              }
            );
          }

          // Remove 'stdin' from sources and replace with filenames!
          sassMap.sources = sassMap.sources.filter(
            (src: string) => src !== 'stdin' && src
          );

          // Replace the map file with the original file name (but new extension)
          sassMap.file = replaceExtension(sassFileSrc, '.css');
          // Apply the map
          applySourceMap(file, sassMap);
        }

        file.contents = sassObj.css;
        file.path = replaceExtension(file.path, '.css');

        if (file.stat) {
          file.stat.atime = file.stat.mtime = file.stat.ctime = new Date();
        }

        cb(null, file);
      };

      //////////////////////////////
      // Handles error message
      //////////////////////////////
      const errorM = (error: any) => {
        const filePath =
          (error.file === 'stdin' ? file.path : error.file) || file.path;
        const relativePath = node.path.relative(process.cwd(), filePath);
        const message = [relativePath, error.formatted].join('\n');

        error.messageFormatted = message;
        error.messageOriginal = error.message;
        error.message = stripAnsi(message);
        error.relativePath = relativePath;

        return cb(new PluginError(PLUGIN_NAME, error));
      };

      //////////////////////////////
      // Sync Sass render
      //////////////////////////////
      try {
        filePush(gulpSass.compiler.renderSync(opts));
      } catch (error) {
        return errorM(error);
      }
    }
  );

//////////////////////////////
// Sync Sass render
//////////////////////////////
gulpSass.sync = (options: object) => gulpSass(options);

//////////////////////////////
// Store compiler in a prop
//////////////////////////////
gulpSass.compiler = sass;

export default gulpSass;
