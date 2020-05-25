class PwaCacheTask extends BalmJS.BalmTask {
  constructor() {
    super('pwa-cache');
  }

  fn = (): any => {
    const globDirectory: string = BalmJS.config.dest.base;
    const swDest = BalmJS.file.absPath(
      `${globDirectory}/${BalmJS.config.pwa.swDestFilename}`
    );

    const newVersion = BalmJS.config.pwa.version || Date.now().toString();
    BalmJS.logger.info('pwa - version', newVersion);

    return gulp
      .src(swDest)
      .pipe(BalmJS.plugins.replace('{{ version }}', newVersion))
      .pipe(
        $.if(
          BalmJS.config.env.isProd,
          BalmJS.plugins.jsmin(BalmJS.config.scripts.options)
        )
      )
      .pipe(gulp.dest(globDirectory));
  };
}

export default PwaCacheTask;
