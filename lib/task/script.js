class Script extends Task {
  constructor() {
    super('scripts');
  }
  get deps() {
    return ['webpack'];
  }
  get fn() {
    return () => {
      let stream = gulp.src(config.tmp.js + '/**/*.{js,map}');

      if (!config.production) {
        return stream.pipe($.plumber())
          .pipe(reload({
            stream: true
          }));
      } else {
        return stream.pipe(gulp.dest(config.target.js));
      }
    };
  }
}

export default Script;
