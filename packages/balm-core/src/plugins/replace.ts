// Reference `gulp-replace@1.1.3`
import { Transform, TransformCallback } from 'node:stream';
import { isText } from 'istextorbinary';
import rs from '../utilities/replacestream.js';

interface GulpReplaceOptions {
  skipBinary?: boolean;
}

const defaultOptions = {
  skipBinary: true
};

function gulpReplace(
  search: string | RegExp,
  _replacement: string | Function,
  options: GulpReplaceOptions = {}
): any {
  // merge options
  options = {
    ...defaultOptions,
    ...options
  };

  return new Transform({
    objectMode: true,
    /**
     * transformation
     * @param {import("vinyl")} file
     * @param {BufferEncoding} enc
     * @param {(error?: Error | null, data?: any) => void} callback
     */
    transform: (
      file: Buffer | string | any,
      encoding: BufferEncoding,
      callback: TransformCallback
    ): void => {
      if (file.isNull()) {
        return callback(null, file);
      }

      let replacement = _replacement;
      if (typeof _replacement === 'function') {
        // Pass the vinyl file object as this.file
        replacement = _replacement.bind({ file: file });
      }

      function doReplace(): any {
        if (file.isStream()) {
          file.contents = file.contents.pipe(rs(search, replacement));
          return callback(null, file);
        }

        if (file.isBuffer()) {
          const content = file.contents.toString();
          if (search instanceof RegExp) {
            file.contents = Buffer.from(
              content.replace(search, replacement as string)
            );
          } else {
            const chunks = content.split(search);

            let result;
            if (typeof replacement === 'function') {
              // Start with the first chunk already in the result
              // Replacements will be added thereafter
              // This is done to avoid checking the value of i in the loop
              result = [chunks[0]];

              // The replacement function should be called once for each match
              for (let i = 1; i < chunks.length; i++) {
                // Add the replacement value
                result.push(replacement(search));

                // Add the next chunk
                result.push(chunks[i]);
              }

              result = result.join('');
            } else {
              result = chunks.join(replacement);
            }

            file.contents = Buffer.from(result);
          }
          return callback(null, file);
        }

        callback(null, file);
      }

      if (options.skipBinary) {
        // fix@istextorbinary: "editions-autoloader-none-broadened: Unable to determine a suitable edition, even after broadening."
        const isNode16 = process.version.split('.')[0] === 'v16';
        if (isNode16) {
          doReplace();
        } else {
          if (isText(file.path, file.contents)) {
            doReplace();
          } else {
            callback(null, file);
          }
        }

        return;
      }

      doReplace();
    }
  });
}

export default gulpReplace;
