class Script {
  get name() {
    return 'scripts';
  }
  get deps() {
    return ['webpack'];
  }
  get fn() {
    if (!config.static) {
      return () => {
        let task = gulp.src(config.tmp.js + '/**/*.js', {
          base: config.tmp.base
        });

        if (config.production) {
          task.pipe($.uglify());
        }

        return task.pipe(gulp.dest(config.target.base))
          .pipe(reload({
            stream: true
          }));
      };
    }
  }
}

export default Script;
