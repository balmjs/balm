class WorkboxSwTask extends BalmJS.BalmTask {
  constructor() {
    super('workbox-sw');

    this.defaultInput = BalmJS.config.pwa.workboxSw;
    this.defaultOutput = BalmJS.config.dest.base;
  }

  fn = (): any => {
    this.init();

    return this.src.pipe(gulp.dest(BalmJS.file.absPath(this.output)));
  };
}

export default WorkboxSwTask;
