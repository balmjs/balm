class FontTask extends BalmJS.BalmTask {
  constructor() {
    super('font');

    this.defaultInput = `${BalmJS.config.src.font}/**/*.{eot,svg,ttf,woff,woff2}`;
    this.defaultOutput = BalmJS.config.dest.font;
  }

  fn = (): any => {
    this.init();

    return this.src.pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  };
}

export default FontTask;
