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

      if (config.scripts.HMR) {
        let compiler = webpack(webpackConfig());

        middleware = [
          require('webpack-dev-middleware')(compiler, {
            noInfo: true,
            publicPath: config.scripts.publicPath
          }),
          require('webpack-hot-middleware')(compiler),
          // proxy api requests
          ...(Object.keys(config.server.proxyTable).map(context => {
            let options = config.server.proxyTable[context];
            if (typeof options === 'string') {
              options = { target: options };
            }
            require('http-proxy-middleware')(context, options);
          }))
        ];
      }

      let options = {
        files: [config.source.js + '/**/*'],
        notify: false
      };
      if (config.server.proxy) {
        options.proxy = {
          target: config.server.proxy,
          middleware: middleware || undefined
        };
      } else {
        options.host = config.server.host;
        options.port = config.server.port;
        options.server = {
          notify: config.server.notify,
          baseDir: [config.tmp.base, config.source.base],
          routes: {
            '/bower_components': 'bower_components'
          },
          middleware: middleware || false
        };
      }

      browserSync(options);

      gulp.watch([
        config.source.html + '/*.{html,php}',
        config.source.img + '/**/*',
        config.tmp.font + '/**/*'
      ]).on('change', reload);

      gulp.watch(config.source.css + '/**/*', [this.getStyleTask()]);
      gulp.watch(config.source.font + '/**/*', ['fonts']);
      gulp.watch(config.workspace + '/bower.json', ['wiredep', 'fonts']);
      if (!config.scripts.HMR) {
        gulp.watch(config.source.js + '/**/*', ['webpack']);
      }
    };
  }
}

export default Server;
