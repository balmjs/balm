const wiredep = require('wiredep').stream;

class Wiredep extends BalmJS.Task {
  constructor() {
    super('wiredep');
  }
  get fn() {
    // Inject bower components
    return () => {
      gulp.src(`${config.source.css}/**/*.${config.styles.ext}`)
        .pipe($.plumber())
        // .pipe($.filter(file => file.stat && file.stat.size))
        .pipe(wiredep({
          cwd: config.workspace,
          ignorePath: /^(\.\.\/)+/
        }))
        .pipe(gulp.dest(config.source.css));

      gulp.src(`${config.source.base}/*.html`)
        .pipe($.plumber())
        .pipe(wiredep({
          cwd: config.workspace,
          ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest(config.source.base));
    };
  }
}

export default Wiredep;
