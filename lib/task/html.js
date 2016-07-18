class Html extends Task {
  constructor() {
    super('html');
  }
  get deps() {
    return ['styles', 'scripts'];
  }
  get fn() {
    return () => {
      let stream = gulp.src(config.source.html + '/*.html');

      if (config.production) {
        stream = stream.pipe($.htmlmin({
          collapseWhitespace: true
        }));
      }

      return stream.pipe(gulp.dest(config.target.html));
    };
  }
}

export default Html;
