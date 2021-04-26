import {
  ASSETS_KEYS,
  ASYNC_SCRIPTS,
  STATIC_ASSETS
} from '../../config/constants';
import { LooseObject } from '@balm-core/index';

class CacheTask extends BalmJS.BalmTask {
  constructor() {
    super('cache');

    const defaultIncludes: string[] = BalmJS.config.scripts.inject
      ? ASSETS_KEYS.filter((assetKey) => assetKey !== 'js').map((assetKey) =>
          BalmJS.file.matchAllFiles(
            (BalmJS.config.dest as LooseObject)[assetKey]
          )
        )
      : ASSETS_KEYS.map((assetKey) =>
          BalmJS.file.matchAllFiles(
            (BalmJS.config.dest as LooseObject)[assetKey]
          )
        );
    const defaultExcludes: string[] = [
      path.join(`!${BalmJS.config.dest.js}`, ASYNC_SCRIPTS, '*'),
      path.join(`!${BalmJS.config.dest.js}`, STATIC_ASSETS, '*'),
      path.join(`!${BalmJS.config.dest.css}`, ASYNC_SCRIPTS, '*'),
      path.join(`!${BalmJS.config.dest.base}`, BalmJS.config.pwa.manifest)
    ];

    const customIncludes: string[] = BalmJS.config.assets.includes;
    const customExcludes: string[] = BalmJS.config.assets.excludes.map(
      (filename: string) => {
        return `!${filename}`;
      }
    );

    this.defaultInput = [
      ...defaultIncludes,
      ...defaultExcludes,
      ...(BalmJS.config.inFrontend
        ? [path.join(BalmJS.config.dest.base, '*.html')]
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
      .pipe($.if(/\.html$/, BalmJS.file.setPublicPath()))
      .pipe(gulp.dest(this.output))
      .pipe($.revDeleteOriginal())
      .pipe($.revAll.manifestFile())
      .pipe(gulp.dest(this.output));
  };
}

export default CacheTask;
