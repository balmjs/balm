import revAll from 'gulp-rev-all';
import { ASSETS_TYPES, CHUNK, ASSET } from '../../config/constants.js';
import { LooseObject } from '@balm-core/index';

class CacheTask extends BalmJS.BalmTask {
  constructor() {
    super('cache');

    const defaultIncludes: string[] = BalmJS.config.scripts.useCache
      ? ASSETS_TYPES.filter((assetType) => assetType !== 'js').map(
          (assetType) =>
            BalmJS.file.matchAllFiles(
              (BalmJS.config.dest as LooseObject)[assetType]
            )
        )
      : ASSETS_TYPES.map((assetType) =>
          BalmJS.file.matchAllFiles(
            (BalmJS.config.dest as LooseObject)[assetType]
          )
        );
    const defaultExcludes: string[] = [
      node.path.join(`!${BalmJS.config.dest.js}`, CHUNK.dir, '*'),
      node.path.join(`!${BalmJS.config.dest.js}`, ASSET.dir, '*'),
      node.path.join(`!${BalmJS.config.dest.base}`, BalmJS.config.pwa.manifest)
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
        ? [node.path.join(BalmJS.config.dest.base, '*.html')]
        : []),
      ...customIncludes,
      ...customExcludes
    ];

    this.defaultOutput = BalmJS.config.inFrontend
      ? BalmJS.config.dest.base
      : BalmJS.config.dest.static;

    // fix for gulp@5
    this.gulpSrcOptions = {
      base: BalmJS.config.dest.base
    };
  }

  fn = (): any => {
    this.init();

    return this.src
      .pipe(revAll.revision(BalmJS.config.assets.options))
      .pipe($.if(/\.html$/, BalmJS.file.setPublicPath()))
      .pipe(gulp.dest(this.output))
      .pipe($.revDeleteOriginal())
      .pipe(revAll.manifestFile())
      .pipe(gulp.dest(this.output));
  };
}

export default CacheTask;
