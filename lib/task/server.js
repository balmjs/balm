import historyApiFallback from 'connect-history-api-fallback';
import webpackConfig from '../webpack.config';
import {isString, isObject} from '../helper';

class Server extends BalmJS.Task {
  constructor() {
    super('serve');
  }
  watch() {
    gulp.watch([
      `${config.source.base}/*.php`,
      `${config.source.img}/**/*`,
      `${config.tmp.font}/**/*`
    ]).on('change', browserSync.reload);

    if (!config.scripts.hot) {
      gulp.watch(`${config.source.js}/**/*`, ['webpack']);
    }
    gulp.watch(`${config.source.base}/*.html`, ['html']);
    gulp.watch(`${config.source.font}/**/*`, ['fonts']);
    gulp.watch(`${config.workspace}/bower.json`, ['wiredep', 'fonts']);
  }
  get deps() {
    let tasks = ['html', this.getStyleTask(), 'scripts', 'fonts'];

    if (!config.static) {
      tasks.push('images');
    }

    return tasks;
  }
  get fn() {
    return () => {
      let middleware;

      if (!config.production) {
        let compiler = webpack(webpackConfig());
        let historyOptions = config.server.historyApiFallback;

        middleware = [
          require('webpack-dev-middleware')(compiler, {
            noInfo: true,
            publicPath: config.assets.publicUrl
          }),
          // Proxy api requests
          ...(Object.keys(config.server.proxyTable).map(context => {
            let options = config.server.proxyTable[context];
            if (isString(options)) {
              options = {
                target: options
              };
            }
            return require('http-proxy-middleware')(context, options);
          }))
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
          `${config.source.js}/**/*`, {
            match: [`${config.source.css}/**/*.${config.styles.ext}`],
            fn: (event, file) => {
              logger.log(event, file);
              if (event === 'change') {
                gulp.start(this.getStyleTask());
              }
            }
          }
        ],
        logPrefix: 'BalmJS',
        logConnections: config.debug,
        notify: false,
        localOnly: config.server.localOnly
      };

      if (config.server.proxy) {
        bsOptions.proxy = {
          target: config.server.proxy,
          middleware: middleware || undefined
        };
      } else {
        bsOptions.open = config.server.open;
        bsOptions.host = config.server.host;
        bsOptions.port = config.server.port;
        bsOptions.server = {
          baseDir: [
            config.tmp.base, config.source.base
          ],
          routes: {
            '/bower_components': path.join(config.workspace, 'bower_components'),
            '/node_modules': path.join(config.workspace, 'node_modules')
          },
          middleware: middleware || false
        };
      }

      browserSync(bsOptions);

      this.watch();
    };
  }
}

export default Server;
