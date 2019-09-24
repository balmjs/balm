class MediaTask extends BalmJS.BalmTask {
  constructor() {
    super('media');

    this.defaultInput = `${BalmJS.config.src.media}/**/*`;
    this.defaultOutput = BalmJS.config.dest.media;
  }

  fn(): void {
    this.init();

    gulp
      .src(BalmJS.file.absPaths(this.input))
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  }
}

export default MediaTask;
