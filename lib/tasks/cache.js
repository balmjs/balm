import { ASSETS_KEYS, ASYNC_SCRIPTS, MANIFEST } from '../config/constants';

class Cache extends Task {
  constructor() {
    super('cache');

    const defaultIncludes = ASSETS_KEYS.map(
      assetKey => `${config.target[assetKey]}/**/*`
    );
    const defaultExcludes = [
      `!${config.target.js}/${ASYNC_SCRIPTS}/*`,
      `!${config.target.base}/${MANIFEST}`
    ];

    let customIncludes = File.absPaths(config.assets.includes).map(filename => {
      return filename;
    });
    let customExcludes = File.absPaths(config.assets.excludes).map(filename => {
      return `!${filename}`;
    });

    this.src = [
      ...defaultIncludes,
      ...defaultExcludes,
      ...customIncludes,
      ...customExcludes
    ];

    if (config.static) {
      this.src.push(`${config.target.base}/*.html`);
    }

    this.dist = config.static ? config.target.base : config.target.static;
  }

  get deps() {
    return ['build'];
  }

  get fn() {
    return () => {
      return gulp
        .src(this.src)
        .pipe($.revAll.revision(config.assets.options))
        .pipe($.if(/\.html$/, File.setPublicPath()))
        .pipe(gulp.dest(this.dist))
        .pipe($.revDeleteOriginal())
        .pipe($.revAll.manifestFile())
        .pipe(gulp.dest(this.dist));
    };
  }
}

export default Cache;
