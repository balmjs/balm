class PwaCacheTask extends BalmJS.BalmTask {
  constructor() {
    super('pwa-cache');

    this.defaultOutput = BalmJS.config.dest.base;
    this.defaultInput = path.join(
      this.defaultOutput,
      BalmJS.config.pwa.swDestFilename
    );
  }

  fn = (): any => {
    this.init();

    const newVersion = BalmJS.config.pwa.version || Date.now().toString();
    BalmJS.logger.info('pwa - version', newVersion);

    return this.src
      .pipe(BalmJS.plugins.replace('{{ version }}', newVersion))
      .pipe(
        $.if(
          BalmJS.config.env.isProd,
          BalmJS.plugins.jsmin(BalmJS.config.scripts.minifyOptions)
        )
      )
      .pipe(gulp.dest(this.output));
  };
}

export default PwaCacheTask;
