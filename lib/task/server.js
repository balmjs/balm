import { getStyleTask } from '../helper';

class Server {
  get name() {
    return 'serve';
  }
  get deps() {
    let tasks = ['scripts', 'fonts'];
    tasks.unshift(getStyleTask());
    return tasks;
  }
  get fn() {
    return () => {
      browserSync({
        notify: config.server.notify,
        port: config.server.port,
        server: {
          baseDir: [config.tmp.base, config.app.base],
          routes: {
            '/bower_components': 'bower_components'
          }
        }
      });

      gulp.watch([
        config.app.html + '/*.html',
        config.app.img + '/**/*',
        config.tmp.font + '/**/*'
      ]).on('change', reload);

      switch (config.styles.ext) {
        case 'sass':
        case 'scss':
          gulp.watch(config.app.css + '/**/*.scss', ['sass']);
          break;
        case 'less':
          gulp.watch(config.app.css + '/**/*.less', ['less']);
          break;
      }
      gulp.watch(config.app.js + '/**/*.js', ['scripts']).on('change', reload);;
      gulp.watch(config.app.font + '/**/*', ['fonts']);
      gulp.watch('bower.json', ['wiredep', 'fonts']);
    };
  }
}

export default Server;
