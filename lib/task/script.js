class Script {
  get name() {
    return 'scripts';
  }
  get deps() {
    return ['webpack'];
  }
  get fn() {
    return () => {
      let task = gulp.src(config.tmp.js + '/**/*.js')
        .pipe($.plumber());

      if (!config.static) {
        if (config.production) {
          return task
            .pipe($.uglify())
            .pipe(gulp.dest(config.target.js));
        } else {
          task.pipe(gulp.dest(config.target.js));
        }
      }

      return task.pipe(reload({
        stream: true
      }));
    };
  }
}

export default Script;
