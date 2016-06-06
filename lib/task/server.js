import { getStyleTask } from '../helper';

class Server {
  get name() {
    return 'serve';
  }
  get deps() {
    let tasks = ['scripts', 'fonts'];
    tasks.unshift(getStyleTask());
    if (!config.static) {
      tasks.push('images');
    }
    return tasks;
  }
  get fn() {
    return () => {
      let options = {
        notify: config.server.notify,
        port: config.server.port
      };
      if (config.server.proxy) {
        options.proxy = config.server.proxy;
      } else {
        options.server = {
          baseDir: [config.tmp.base, config.app.base],
          routes: {
            '/bower_components': 'bower_components'
          }
        };
      }
      browserSync(options);

      gulp.watch([
        config.app.html + '/*.{html,php}',
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
