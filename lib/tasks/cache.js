import {ASYNC_FOLDER} from '../config/constants';

class Cache extends Task {
  constructor() {
    super('cache');

    let includes = File.absPaths(config.assets.includes).map(filename => {
      return filename;
    });

    let excludes = File.absPaths(config.assets.excludes).map(filename => {
      return `!${filename}`;
    });

    this.src = [
      `${config.target.css}/**/*`,
      `${config.target.js}/**/*`,
      `!${config.target.js}/${ASYNC_FOLDER}/*`,
      `${config.target.img}/**/*`,
      `${config.target.font}/**/*`,
      `${config.target.media}/**/*`,
      // For others
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
        .pipe($.if(/\.html$/, File.setPublicPath()))
        .pipe(gulp.dest(this.dist))
        .pipe($.revDeleteOriginal())
        .pipe($.revAll.manifestFile())
        .pipe(gulp.dest(this.dist));
    };
  }
}

export default Cache;
