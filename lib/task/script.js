class Script {
  get name() {
    return 'scripts';
  }
  get deps() {
    return ['webpack'];
  }
  get fn() {
    return () => {
      let task = gulp.src(config.tmp.js + '/**/*.{js,map}')
        .pipe($.plumber());

      if (!config.production) {
        return task.pipe(reload({
          stream: true
        }));
      } else {
        if (!config.cache || config.static === 'async') {
          return task.pipe(gulp.dest(config.target.js));
        }
      }
    };
  }
}

export default Script;
