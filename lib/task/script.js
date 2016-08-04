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

      if (config.production) {
        stream = stream.pipe(gulp.dest(config.target.js));
      } else {
        stream = stream.pipe($.plumber())
          .pipe(reload({
            stream: true
          }));
      }

      return stream;
    };
  }
}

export default Script;
