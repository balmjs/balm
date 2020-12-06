// Reference `gulp-imagemin@7.1.0`
import { TransformCallback } from 'stream';
import through2Concurrent from 'through2-concurrent';
import imagemin from 'imagemin';
import prettyBytes from 'pretty-bytes';

const PLUGIN_NAME = 'imagemin';
const defaultPlugins = ['gifsicle', 'mozjpeg', 'optipng', 'svgo'];

const loadPlugin = (plugin: string, ...args: any) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(`imagemin-${plugin}`)(...args);
  } catch (_) {
    BalmJS.logger.error(
      PLUGIN_NAME,
      `Couldn't load default plugin "${plugin}"`
    );
  }
};

const exposePlugin = (plugin: string) => (...args: any) =>
  loadPlugin(plugin, ...args);

const getDefaultPlugins = () =>
  defaultPlugins.reduce((plugins, plugin) => {
    const instance = loadPlugin(plugin);

    if (!instance) {
      return plugins;
    }

    return plugins.concat(instance);
  }, []);

const gulpImagemin = (customPlugins?: Function[]): any => {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];

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

    if (!validExtensions.includes(path.extname(file.path).toLowerCase())) {
      BalmJS.logger.info(
        PLUGIN_NAME,
        `Skipping unsupported image "${file.relative}"`
      );

      callback(null, file);
      return;
    }

    const plugins = customPlugins || getDefaultPlugins();

    (async () => {
      try {
        const data = await imagemin.buffer(file.contents, {
          plugins
        });
        const originalSize = file.contents.length;
        const optimizedSize = data.length;
        const saved = originalSize - optimizedSize;
        const percent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
        const savedMsg = `saved ${prettyBytes(saved)} - ${percent
          .toFixed(1)
          .replace(/\.0$/, '')}%`;
        const msg = saved > 0 ? savedMsg : 'already optimized';

        if (saved > 0) {
          totalBytes += originalSize;
          totalSavedBytes += saved;
          totalFiles++;
        }

        BalmJS.logger.debug(PLUGIN_NAME, `${file.relative} (${msg})`);

        file.contents = data;
        callback(null, file);
      } catch (error) {
        callback(new PluginError(PLUGIN_NAME, error, { fileName: file.path }));
      }
    })();
  }

  function flush(callback: TransformCallback): void {
    const percent = totalBytes > 0 ? (totalSavedBytes / totalBytes) * 100 : 0;
    let msg = `Minified ${totalFiles} image${totalFiles > 1 ? 's' : ''}`;

    if (totalFiles > 0) {
      msg += ` (saved ${prettyBytes(totalSavedBytes)} - ${percent
        .toFixed(1)
        .replace(/\.0$/, '')}%)`;
    }

    BalmJS.logger.info(PLUGIN_NAME, msg);

    callback();
  }

  return through2Concurrent.obj({ maxConcurrency: 8 }, transform, flush);
};

const gifsicle = exposePlugin('gifsicle');
const mozjpeg = exposePlugin('mozjpeg');
const optipng = exposePlugin('optipng');
const svgo = exposePlugin('svgo');

export default gulpImagemin;
export { gifsicle, mozjpeg, optipng, svgo };
