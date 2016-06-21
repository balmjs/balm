class Script {
  get name() {
    return 'scripts';
  }
  get deps() {
    return ['webpack'];
  }
  get fn() {
    return () => {
      let task = gulp.src(config.tmp.js + '/**/*.js', {
        base: config.tmp.base
      }).pipe($.plumber());

      if (!config.static) {
        if (config.production) {
          return task
            .pipe($.uglify())
            .pipe(gulp.dest(config.target.base));
        } else {
          task.pipe(gulp.dest(config.target.base));
        }
      }

      return task.pipe(reload({
        stream: true
      }));
    };
  }
}

export default Script;
