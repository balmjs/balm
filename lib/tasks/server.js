import historyApiFallback from 'connect-history-api-fallback';
import { webpackConfig } from '../webpack.config';
import { isString, isObject, mergeDeep } from '../helpers';

class Server extends Task {
  constructor() {
    super('serve');
  }

  watch() {
    gulp
      .watch([
        `${config.source.base}/*.php`,
        `${config.source.img}/**/*`,
        `${config.tmp.font}/**/*`
      ])
      .on('change', browserSync.reload);

    gulp.watch(
      `${config.source.css}/**/*.${config.styles.ext}`,
      getNamespace([this.getStyleTask()])
    );
    if (config.scripts.entry && !config.scripts.hot) {
      gulp.watch(`${config.source.js}/**/*`, getNamespace(['webpack']));
    }
    gulp
      .watch(`${config.source.base}/*.html`, getNamespace(['html']))
      .on('change', browserSync.reload);
    gulp.watch(`${config.source.font}/**/*`, getNamespace(['fonts']));
    gulp.watch(
      `${config.workspace}/bower.json`,
      getNamespace(['wiredep', 'fonts'])
    );
  }

  get deps() {
    let tasks = ['html', this.getStyleTask(), 'scripts', 'fonts'];

    if (!config.static) {
      tasks.concat(['images', 'media']);
    }

    return tasks;
  }

  get fn() {
    return () => {
      let middleware;

      if (config.scripts.entry && !config.production) {
        let compiler = webpack(webpackConfig());
        let historyOptions = config.server.historyApiFallback;

        middleware = [
          require('webpack-dev-middleware')(compiler, {
            logLevel: config.server.logLevel,
            publicPath: config.assets.publicUrl,
            stats: false
          }),
          // Proxy api requests
          ...Object.keys(config.server.proxyTable).map(context => {
            let options = config.server.proxyTable[context];
            if (isString(options)) {
              options = {
                target: options
              };
            }
            return require('http-proxy-middleware')(context, options);
          })
        ];

        if (config.scripts.hot) {
          middleware.push(require('webpack-hot-middleware')(compiler));
        }

        if (historyOptions) {
          let historyMiddleware = isObject(historyOptions)
            ? historyApiFallback(historyOptions)
            : historyApiFallback();
          middleware.push(historyMiddleware);
        }
      }

      let bsOptions = {
        files: [
          `${config.source.js}/**/*`,
          {
            match: [`${config.source.css}/**/*.${config.styles.ext}`],
            fn: (event, file) => {
              logger.info(event, file);
              if (event === 'add') {
                gulp.watch(
                  File.absPaths(file),
                  getNamespace([this.getStyleTask()])
                );
              }
            }
          }
        ],
        logPrefix: 'BalmJS',
        notify: false,
        https: config.server.https,
        host: config.server.host,
        port: config.server.port,
        open: config.server.open,
        browser: config.server.browser,
        reloadDelay: config.server.reloadDelay,
        localOnly: config.server.localOnly
      };

      if (config.server.proxy) {
        bsOptions.proxy = {
          target: config.server.proxy,
          middleware: middleware || undefined
        };
        bsOptions.serveStatic = config.server.serveStatic;
      } else {
        bsOptions.server = {
          baseDir: [config.tmp.base, config.source.base],
          routes: {
            '/bower_components': File.absPaths('bower_components'),
            '/node_modules': File.absPaths('node_modules')
          }
        };
        bsOptions.middleware = middleware || false;
      }

      bsOptions = mergeDeep(bsOptions, config.server.options);

      browserSync(bsOptions);

      this.watch();
    };
  }
}

export default Server;
