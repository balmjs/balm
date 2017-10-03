class Script extends Task {
  constructor() {
    super('scripts');
  }
  get deps() {
    return ['webpack'];
  }
  get fn() {
    return () => {
      let stream = gulp.src(`${config.tmp.js}/**/*`);

      if (config.production) {
        stream = stream.pipe(gulp.dest(config.target.js));
      } else {
        stream = stream.pipe(browserSync.stream({match: '**/*.js'}));
      }

      return stream;
    };
  }
}

export default Script;
