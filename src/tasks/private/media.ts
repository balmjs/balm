class MediaTask extends BalmJS.BalmTask {
  constructor() {
    super('media');

    this.defaultInput = `${BalmJS.config.src.media}/**/*`;
    this.defaultOutput = BalmJS.config.dest.media;
  }

  fn = (): any => {
    this.init();

    return this.src.pipe(gulp.dest(BalmJS.file.absPath(this.output)));
  };
}

export default MediaTask;
