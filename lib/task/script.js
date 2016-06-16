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
      });

      if (!config.static) {
        if (config.production) {
          task.pipe($.uglify());
        }

        task.pipe(gulp.dest(config.target.base));
      }

      return task.pipe(reload({
        stream: true
      }));
    };
  }
}

export default Script;
