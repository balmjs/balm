class Publish extends Task {
  constructor() {
    super('publish');
  }
  get fn() {
    return () => {
      if (config.production) {
        return gulp.src(this.src)
          .pipe(gulp.dest(this.dist));
      }
    };
  }
}

export default Publish;
