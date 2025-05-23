// Reference `gulp-postcss@10.0.0`
import { Transform } from 'node:stream';
import postcss from 'postcss';
import postcssLoadConfig from 'postcss-load-config';
import applySourceMap from 'vinyl-sourcemaps-apply';
import { LooseObject, BalmError } from '@balm-core/index';

const PLUGIN_NAME = 'postcss';

function gulpPostcss(cb: Function): any {
  return function (plugins: any, options: object) {
    if (Array.isArray(plugins)) {
      return cb(() =>
        Promise.resolve({
          plugins: plugins,
          options: options
        })
      );
    } else if (typeof plugins === 'function') {
      return cb((file: any) => Promise.resolve(plugins(file)));
    } else {
      const contextOptions = plugins || {};
      return cb((file: any) => {
        let configPath;
        if (contextOptions.config) {
          if (node.path.isAbsolute(contextOptions.config)) {
            configPath = contextOptions.config;
          } else {
            configPath = node.path.join(file.base, contextOptions.config);
          }
        } else {
          configPath = file.dirname;
        }

        const ctx = {
          file,
          options: contextOptions // @TODO: The options property is deprecated and should be removed
        } as any;
        return postcssLoadConfig(ctx, configPath);
      });
    }
  };
}

export default gulpPostcss((loadConfig: Function) => {
  const stream = new Transform({ objectMode: true });

  stream._transform = function (file, encoding, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return handleError('Streams are not supported!');
    }

    // Protect `from` and `map` if using gulp-sourcemaps
    const isProtected: LooseObject = file.sourceMap
      ? { from: true, map: true }
      : {};

    const options: LooseObject = {
      from: file.path,
      to: file.path,
      // Generate a separate source map for gulp-sourcemaps
      map: file.sourceMap ? { annotation: false } : false
    };

    loadConfig(file)
      .then(function (config: any) {
        const configOpts = config.options || {};
        // Extend the default options if not protected
        for (const opt in configOpts) {
          if (
            Object.prototype.hasOwnProperty.call(configOpts, opt) &&
            !isProtected[opt]
          ) {
            options[opt] = configOpts[opt];
          } else {
            BalmJS.logger.info(
              PLUGIN_NAME,
              `${file.relative}\nCannot override ${opt} option, because it is required by gulp-sourcemaps`
            );
          }
        }
        return postcss(config.plugins || []).process(file.contents, options);
      })
      .then(handleResult, handleError);

    function handleResult(result: any) {
      let map;
      const warnings = result.warnings().join('\n');

      file.contents = Buffer.from(result.css);

      // Apply source map to the chain
      if (file.sourceMap) {
        map = result.map.toJSON();
        map.file = file.relative;
        map.sources = [].map.call(map.sources, function (source) {
          return node.path.join(node.path.dirname(file.relative), source);
        });
        applySourceMap(file, map);
      }

      if (warnings) {
        BalmJS.logger.info(PLUGIN_NAME, `${file.relative}\nwarnings`);
      }

      setImmediate(function () {
        cb(null, file);
      });
    }

    function handleError(error: any) {
      const errorOptions: LooseObject = {
        fileName: file.path,
        showStack: true
      };
      if (error.name === 'CssSyntaxError') {
        errorOptions.error = error;
        errorOptions.fileName = error.file || file.path;
        errorOptions.lineNumber = error.line;
        errorOptions.showProperties = false;
        errorOptions.showStack = false;
        error = `${error.message}\n\n${error.showSourceCode()}\n`;
      }
      // Prevent stream’s unhandled exception from
      // being suppressed by Promise
      setImmediate(function () {
        cb(new PluginError(PLUGIN_NAME, error as BalmError, errorOptions));
      });
    }
  };

  return stream;
});
