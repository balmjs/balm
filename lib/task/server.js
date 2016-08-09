import proxy from 'http-proxy-middleware';
import webpack from 'webpack';
import webpackConfig from '../webpack.config';

class Server extends Task {
  constructor() {
    super('serve');
  }
  get deps() {
    let tasks = [this.getStyleTask(), 'scripts', 'fonts'];

    if (!config.static) {
      tasks.push('images');
    }

    return tasks;
  }
  get fn() {
    return () => {
      let middleware;
      let compiler = webpack(webpackConfig());

      if (!config.production) {
        middleware = [
          require('webpack-dev-middleware')(compiler, {
            noInfo: true,
            publicPath: config.scripts.publicPath
          }),
          // proxy api requests
          ...(Object.keys(config.server.proxyTable).map(context => {
            let options = config.server.proxyTable[context];
            if (typeof options === 'string') {
              options = {
                target: options
              };
            }
            return proxy(context, options);
          }))
        ];
      }
      if (config.scripts.HMR) {
        middleware.push(require('webpack-hot-middleware')(compiler));
      }

      let bsOptions = {
        files: [config.source.js + '/**/*', {
          match: [config.source.css + '/**/*.' + config.styles.ext],
          fn: (event, file) => {
            gulp.watch(file, [this.getStyleTask()]);
          }
        }],
        notify: false,
        localOnly: config.server.localOnly
      };
      if (config.server.proxy) {
        bsOptions.proxy = {
          target: config.server.proxy,
          middleware: middleware || undefined
        };
      } else {
        bsOptions.host = config.server.host;
        bsOptions.port = config.server.port;
        bsOptions.server = {
          baseDir: [config.tmp.base, config.source.base],
          routes: {
            '/bower_components': 'bower_components'
          },
          middleware: middleware || false
        };
      }

      browserSync(bsOptions);

      gulp.watch([
        config.source.html + '/*.{html,php}',
        config.source.img + '/**/*',
        config.tmp.font + '/**/*'
      ]).on('change', reload);

      gulp.watch(config.source.font + '/**/*', ['fonts']);
      gulp.watch(config.workspace + '/bower.json', ['wiredep', 'fonts']);
      if (!config.scripts.HMR) {
        gulp.watch(config.source.js + '/**/*', ['webpack']);
      }
    };
  }
}

export default Server;
