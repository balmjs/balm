class ExtraTask extends BalmJS.BalmTask {
  constructor() {
    super('extra');

    const includeGlobs: string[] = [];
    if (BalmJS.config.extras.includes.length) {
      for (const filename of BalmJS.config.extras.includes) {
        includeGlobs.push(node.path.join(BalmJS.config.src.base, filename));
      }
    }

    const excludeGlobs: string[] = [];
    if (BalmJS.config.extras.excludes.length) {
      for (const filename of BalmJS.config.extras.excludes) {
        excludeGlobs.push(
          node.path.join(`!${BalmJS.config.src.base}`, filename)
        );
      }
    }

    const defaultGlobs: string[] = [
      node.path.join(BalmJS.config.src.base, '*.*'), // All files but ignore all folders in the app root directory
      node.path.join(`!${BalmJS.config.src.base}`, '*.html'),
      node.path.join(`!${BalmJS.config.src.base}`, BalmJS.config.pwa.manifest),
      ...includeGlobs, // e.g. CNAME
      ...excludeGlobs
    ];

    this.defaultInput = defaultGlobs;
    this.defaultOutput = BalmJS.config.dest.base;
  }

  fn = (): any => {
    this.init();

    this.gulpSrcOptions = {
      dot: true
    };

    return this.src.pipe(gulp.dest(this.output));
  };
}

export default ExtraTask;
