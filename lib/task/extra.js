class Extra extends BalmJS.Task {
  constructor() {
    super('extras');
  }
  get fn() {
    return () => {
      return gulp.src([
        `${config.source.base}/*.*`, // for all files (exclude folder)
        `!${config.source.html}/*.html`,
        `!${config.source.base}/*.{css,js,json,md,lock}`,
        `!${config.source.base}/.git*`
      ], {dot: true})
        .pipe(gulp.dest(config.target.base));
    };
  }
}

export default Extra;
