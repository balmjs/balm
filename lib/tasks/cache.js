import {ASYNC_FOLDER} from '../config/constants';

class Cache extends BalmJS.Task {
  constructor() {
    super('cache');

    let includes = this.getAbsPaths(config.assets.includes).map(filename => {
      return filename;
    });

    let excludes = this.getAbsPaths(config.assets.excludes).map(filename => {
      return `!${filename}`;
    });

    this.src = [
      `${config.target.css}/**/*`,
      `${config.target.js}/**/*`,
      `!${config.target.js}/${ASYNC_FOLDER}/*`,
      `${config.target.img}/**/*`,
      `${config.target.media}/**/*`,
      `${config.target.font}/**/*`,
      // For other vendors
      ...includes,
      ...excludes
    ];

    if (config.static) {
      this.src.push(`${config.target.base}/*.html`);
    }

    this.dist = config.static
      ? config.target.base
      : config.target.static;
  }
  get deps() {
    return ['build'];
  }
  get fn() {
    return () => {
      return gulp.src(this.src)
        .pipe($.revAll.revision(config.assets.options))
        .pipe(gulp.dest(this.dist))
        .pipe($.revDeleteOriginal())
        .pipe($.revAll.manifestFile())
        .pipe(gulp.dest(this.dist));
    };
  }
}

export default Cache;
