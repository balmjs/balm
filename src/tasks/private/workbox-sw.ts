class WorkboxSwTask extends BalmJS.BalmTask {
  constructor() {
    super('workbox-sw');

    this.defaultInput = BalmJS.config.pwa.workboxSw;
    this.defaultOutput = BalmJS.config.dest.base;
  }

  fn(): void {
    this.init();

    this.src.pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  }
}

export default WorkboxSwTask;
