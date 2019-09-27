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

    const customIncludes: string[] = BalmJS.file.absPaths(
      BalmJS.config.assets.includes
    ) as string[];
    const customExcludes: string[] = (BalmJS.file.absPaths(
      BalmJS.config.assets.excludes
    ) as string[]).map((filename: string) => {
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

  fn = (): any => {
    this.init();

    return this.src
      .pipe($.revAll.revision(BalmJS.config.assets.options))
      .pipe(gulp.dest(BalmJS.file.absPath(this.output)))
      .pipe($.revDeleteOriginal())
      .pipe($.revAll.manifestFile())
      .pipe(gulp.dest(BalmJS.file.absPath(this.output)));
  };
}

export default CacheTask;
