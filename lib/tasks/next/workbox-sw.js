class WorkboxSwTask extends BalmTask {
  constructor() {
    super('workbox-sw');

    this.input = config.pwa.workboxSw;
    this.output = config.isProd ? config.roots.target : config.roots.tmp;
  }

  get fn() {
    return () => {
      return src(BalmFile.absPaths(this.input)).pipe(
        dest(BalmFile.absPaths(this.output))
      );
    };
  }
}

export default WorkboxSwTask;
