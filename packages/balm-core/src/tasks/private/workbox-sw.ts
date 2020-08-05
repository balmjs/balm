class WorkboxSwTask extends BalmJS.BalmTask {
  constructor() {
    super('workbox-sw');

    this.defaultInput = [
      BalmJS.config.pwa.workboxSw,
      `${BalmJS.config.pwa.workboxSw}.map`
    ];
    this.defaultOutput = BalmJS.config.dest.base;
  }

  fn = (): any => {
    this.init();

    return this.src.pipe(gulp.dest(this.output));
  };
}

export default WorkboxSwTask;
