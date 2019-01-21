import {
  ASSETS_KEYS,
  ASYNC_SCRIPTS,
  STATIC_ASSETS,
  MANIFEST
} from '../../config/constants';

class CacheTask extends BalmTask {
  constructor() {
    super('cache');

    let defaultIncludes = ASSETS_KEYS.map(
      assetKey => `${config.target[assetKey]}/**/*`
    );
    let defaultExcludes = [
      `!${config.target.base}/${MANIFEST}`,
      `!${config.target.js}/${ASYNC_SCRIPTS}/*`,
      `!${config.target.js}/${STATIC_ASSETS}/*`
    ];

    let customIncludes = BalmFile.absPaths(config.assets.includes).map(
      filename => {
        return filename;
      }
    );
    let customExcludes = BalmFile.absPaths(config.assets.excludes).map(
      filename => {
        return `!${filename}`;
      }
    );

    this.input = [
      ...defaultIncludes,
      ...defaultExcludes,
      ...customIncludes,
      ...customExcludes
    ];
    if (config.static) {
      this.input.push(`${config.target.base}/*.html`);
    }

    this.output = config.static ? config.target.base : config.target.static;
  }

  get fn() {
    return () => {
      return src(this.input)
        .pipe($.revAll.revision(config.assets.options))
        .pipe($.if(/\.html$/, BalmFile.setPublicPath()))
        .pipe(dest(this.output))
        .pipe($.revDeleteOriginal())
        .pipe($.revAll.manifestFile())
        .pipe(dest(this.output));
    };
  }
}

export default CacheTask;
