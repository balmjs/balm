class FontTask extends BalmJS.BalmTask {
  constructor() {
    super('font');

    this.defaultInput = BalmJS.file.matchAllFiles(
      BalmJS.config.src.font,
      '*.{eot,svg,ttf,woff,woff2}'
    );
    this.defaultOutput = BalmJS.config.dest.font;
  }

  fn = (): any => {
    this.init();

    return this.src.pipe(gulp.dest(BalmJS.file.absPath(this.output)));
  };
}

export default FontTask;
