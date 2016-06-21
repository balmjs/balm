import webpack from 'webpack';
import webpackConfig from '../webpack.config';

class Server {
  get name() {
    return 'serve';
  }
  get deps() {
    let tasks = ['styles', 'scripts', 'fonts'];
    if (!config.static) {
      tasks.push('images');
    }
    return tasks;
  }
  get fn() {
    return () => {
      let compiler = webpack(webpackConfig());
      let middleware = [
        require('webpack-dev-middleware')(compiler, {
          noInfo: true,
          publicPath: config.scripts.publicPath
        }),
        require('webpack-hot-middleware')(compiler)
      ];

      let options = {
        files: [config.source.js + '/**/*']
      };
      if (config.proxy) {
        options.proxy = {
          target: config.proxy,
          middleware: middleware
        };
      } else {
        options.server = {
          host: config.server.host,
          port: config.server.port,
          notify: config.server.notify,
          baseDir: [config.tmp.base, config.source.base],
          routes: {
            '/bower_components': 'bower_components'
          },
          middleware: middleware
        };
      }

      browserSync(options);

      gulp.watch([
        config.source.html + '/*.{html,php}',
        config.source.img + '/**/*',
        config.tmp.font + '/**/*'
      ]).on('change', reload);

      gulp.watch(config.source.css + '/**/*', ['styles']);
      gulp.watch(config.source.font + '/**/*', ['fonts']);
      gulp.watch('bower.json', ['wiredep', 'fonts']);
    };
  }
}

export default Server;
