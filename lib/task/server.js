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
      let options = {
        notify: config.server.notify,
        host: config.server.host,
        port: config.server.port
      };
      if (config.server.proxy) {
        options.proxy = config.server.proxy;
      } else {
        options.server = {
          baseDir: [config.tmp.base, config.source.base],
          routes: {
            '/bower_components': 'bower_components'
          }
        };
      }
      browserSync(options);

      gulp.watch([
        config.source.html + '/*.{html,php}',
        config.source.img + '/**/*',
        config.tmp.font + '/**/*'
      ]).on('change', reload);

      gulp.watch(config.source.css + '/**/*', ['styles']);
      gulp.watch(config.source.js + '/**/*', ['scripts']);
      gulp.watch(config.source.font + '/**/*', ['fonts']);
      gulp.watch('bower.json', ['wiredep', 'fonts']);
    };
  }
}

export default Server;
