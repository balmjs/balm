import {
  ASSETS_KEYS,
  ASYNC_SCRIPTS,
  STATIC_ASSETS,
  MANIFEST
} from '../../config/constants';

class CacheTask extends BalmJS.BalmTask {
  constructor() {
    super('cache');

    const defaultIncludes = BalmJS.config.scripts.inject
      ? ASSETS_KEYS.filter(assetKey => assetKey !== 'js').map(
          assetKey => `${BalmJS.config.dest[assetKey]}/**/*`
        )
      : ASSETS_KEYS.map(assetKey => `${BalmJS.config.dest[assetKey]}/**/*`);
    const defaultExcludes = [
      `!${BalmJS.config.dest.base}/${MANIFEST}`,
      `!${BalmJS.config.dest.js}/${ASYNC_SCRIPTS}/*`,
      `!${BalmJS.config.dest.js}/${STATIC_ASSETS}/*`
    ];

    const customIncludes = BalmJS.file.absPaths(BalmJS.config.assets.includes);
    const customExcludes = BalmJS.file
      .absPaths(BalmJS.config.assets.excludes)
      .map((filename: string) => {
        return `!${filename}`;
      });

    this.defaultInput = [
      ...defaultIncludes,
      ...defaultExcludes,
      ...(BalmJS.config.inFrontend
        ? [`${BalmJS.config.dest.base}/*.html`]
        : []),
      ...customIncludes,
      ...customExcludes
    ];

    this.defaultOutput = BalmJS.config.inFrontend
      ? BalmJS.config.dest.base
      : BalmJS.config.dest.static;
  }

  fn(): void {
    this.init();

    gulp
      .src(BalmJS.file.absPaths(this.input))
      .pipe(
        $.plumber(function(error: any): void {
          BalmJS.logger.error('cache task', error.message);
        })
      )
      .pipe($.revAll.revision(BalmJS.config.assets.options))
      .pipe(gulp.dest(this.output))
      .pipe($.revDeleteOriginal())
      .pipe($.revAll.manifestFile())
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  }
}

export default CacheTask;
