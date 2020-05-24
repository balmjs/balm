// Reference `gulp-replace@1.0.0`
import { TransformCallback } from 'stream';
import { Transform } from 'readable-stream';
import istextorbinary from 'istextorbinary';
import rs from '../utilities/replacestream';

interface GulpReplaceOptions {
  skipBinary?: boolean;
}

function gulpReplace(
  search: string | RegExp,
  _replacement: string | Function,
  options: GulpReplaceOptions = {}
): any {
  if (options.skipBinary === undefined) {
    options.skipBinary = true;
  }

  return new Transform({
    objectMode: true,
    transform: (
      file: any,
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

      if (options && options.skipBinary) {
        istextorbinary.isText(
          file.path,
          file.contents,
          (err: any, result: boolean) => {
            if (err) {
              return callback(err, file);
            }

            if (result) {
              doReplace();
            } else {
              callback(null, file);
            }
          }
        );

        return;
      }

      doReplace();
    }
  });
}

export default gulpReplace;
