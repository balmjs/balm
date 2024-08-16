// Reference `gulp-imagemin@9.0.0`
import { TransformCallback } from 'node:stream';
import imagemin from 'imagemin';
import prettyBytes from 'pretty-bytes';
import through2Concurrent from 'through2-concurrent';
import { BalmError } from '@balm-core/index';

const PLUGIN_NAME = 'imagemin';
const defaultPlugins = ['gifsicle', 'mozjpeg', 'optipng', 'svgo'];

const loadPlugin = (plugin: string, ...args: any) => {
  try {
    return requireModule(`imagemin-${plugin}`)(...args);
  } catch (_) {
    BalmJS.logger.error(
      PLUGIN_NAME,
      `Could not load default plugin \`${plugin}\``
    );
  }
};

const exposePlugin =
  (plugin: string) =>
  (...args: any) =>
    loadPlugin(plugin, ...args);

const getDefaultPlugins = () =>
  defaultPlugins.flatMap((plugin) => loadPlugin(plugin));

function gulpImagemin(customPlugins?: Function[]): any {
  if (typeof customPlugins === 'object' && !Array.isArray(customPlugins)) {
    customPlugins = undefined;
  }

  const validExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.svg']);

  let totalBytes = 0;
  let totalSavedBytes = 0;
  let totalFiles = 0;

  function transform(
    file: Buffer | string | any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    if (file.isNull()) {
      callback(null, file);
      return;
    }

    if (file.isStream()) {
      callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return;
    }

    if (
      !validExtensions.has(node.path.extname(file.path as string).toLowerCase())
    ) {
      BalmJS.logger.info(
        PLUGIN_NAME,
        `Skipping unsupported image "${file.relative}"`
      );

      callback(null, file);
      return;
    }

    const plugins = customPlugins ?? getDefaultPlugins();

    (async () => {
      try {
        const data = Buffer.from(
          await imagemin.buffer(file.contents, {
            plugins
          })
        );
        const originalSize = file.contents.length;
        const optimizedSize = data.length;
        const saved = originalSize - optimizedSize;
        const percent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
        const savedMessage = `saved ${prettyBytes(saved)} - ${percent
          .toFixed(1)
          .replace(/\.0$/, '')}%`;
        const message = saved > 0 ? savedMessage : 'already optimized';

        if (saved > 0) {
          totalBytes += originalSize;
          totalSavedBytes += saved;
          totalFiles++;
        }

        BalmJS.logger.debug(PLUGIN_NAME, `${file.relative} (${message})`);

        file.contents = data;

        callback(null, file);
      } catch (error) {
        callback(
          new PluginError(PLUGIN_NAME, error as BalmError, {
            fileName: file.path
          })
        );
      }
    })();
  }

  function flush(callback: TransformCallback): void {
    const percent = totalBytes > 0 ? (totalSavedBytes / totalBytes) * 100 : 0;
    let message = `Minified ${totalFiles} image${totalFiles > 1 ? 's' : ''}`;

    if (totalFiles > 0) {
      message += ` (saved ${prettyBytes(totalSavedBytes)} - ${percent
        .toFixed(1)
        .replace(/\.0$/, '')}%)`;
    }

    BalmJS.logger.info(PLUGIN_NAME, message);

    callback();
  }

  return through2Concurrent.obj({ maxConcurrency: 8 }, transform, flush);
}

const gifsicle = exposePlugin('gifsicle');
const mozjpeg = exposePlugin('mozjpeg');
const optipng = exposePlugin('optipng');
const svgo = exposePlugin('svgo');

const getDefaultImagePlugins = (): {
  [key: string]: Function;
} => ({
  gif: gifsicle(),
  jpeg: mozjpeg(),
  png: optipng(),
  svg: svgo()
});

export default gulpImagemin;
export { getDefaultImagePlugins };
