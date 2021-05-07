class PwaCacheTask extends BalmJS.BalmTask {
  constructor() {
    super('pwa-cache');

    this.defaultOutput = BalmJS.config.dest.base;
    this.defaultInput = path.join(
      this.defaultOutput,
      BalmJS.config.pwa.swDestFilename
    );
  }

  clear(): void {
    const swOrigin = BalmJS.file.absPath(
      path.join(BalmJS.config.dest.base, BalmJS.config.pwa.swSrcFilename)
    );

    requireModule('del')(swOrigin, { force: true });
  }

  fn = (): any => {
    this.init();

    const newVersion = BalmJS.config.pwa.version || Date.now().toString();
    BalmJS.logger.info('pwa - version', newVersion);

    const stream = this.src
      .pipe(BalmJS.plugins.replace('{{ version }}', newVersion))
      .pipe(
        $.if(
          BalmJS.config.env.isProd,
          BalmJS.plugins.jsmin(BalmJS.config.scripts.minifyOptions)
        )
      )
      .pipe(gulp.dest(this.output));

    this.clear();

    return stream;
  };
}

export default PwaCacheTask;
