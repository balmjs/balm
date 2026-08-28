import { deleteAsync } from 'del';

class PwaCacheTask extends BalmJS.BalmTask {
  constructor() {
    super('pwa-cache');

    this.defaultOutput = BalmJS.config.dest.base;
    this.defaultInput = node.path.join(
      this.defaultOutput,
      BalmJS.config.pwa.swDestFilename
    );
  }

  clear(): void {
    if (BalmJS.config.pwa.swSrcFilename !== BalmJS.config.pwa.swDestFilename) {
      const swOrigin = BalmJS.file.absPath(
        node.path.join(BalmJS.config.dest.base, BalmJS.config.pwa.swSrcFilename)
      );

      deleteAsync(swOrigin, { force: true });
    }
  }

  fn = (): any => {
    this.init();

    const swDest =
      typeof this.input === 'string' && this.input
        ? BalmJS.file.absPath(this.input)
        : '';
    if (!swDest || !node.fs.existsSync(swDest)) {
      return Promise.resolve();
    }

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
