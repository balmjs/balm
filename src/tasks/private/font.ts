class FontTask extends BalmJS.BalmTask {
  constructor() {
    super('font');

    this.defaultInput = `${BalmJS.config.src.font}/**/*.{eot,svg,ttf,woff,woff2}`;
    this.defaultOutput = BalmJS.config.dest.font;
  }

  fn(): void {
    this.init();

    gulp
      .src(BalmJS.file.absPaths(this.input))
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  }
}

export = FontTask;
