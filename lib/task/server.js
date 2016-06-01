class Server {
  get name() {
    return 'serve';
  }
  get deps() {
    return ['sass', 'scripts', 'fonts'];
  }
  get fn() {
    return () => {
      browserSync({
        notify: false,
        port: config.server.port,
        server: {
          baseDir: [config.tmp.base, config.app.base],
          routes: {
            '/bower_components': 'bower_components'
          }
        }
      });

      gulp.watch([
        config.app.base + '/*.html',
        config.app.img + '/**/*',
        config.tmp.font + '/**/*'
      ]).on('change', reload);

      gulp.watch(config.app.css + '/**/*.scss', ['sass']);
      gulp.watch(config.app.js + '/**/*.js', ['scripts']).on('change', reload);;
      gulp.watch(config.app.font + '/**/*', ['fonts']);
      gulp.watch('bower.json', ['wiredep', 'fonts']);
    };
  }
}

export default Server;
